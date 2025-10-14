// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
@testable import SpectaclesKit
import XCTest

final class QLICRunLoopTests: XCTestCase {
    var clientRunloop: QLICRunLoop!
    var serverRunloop: QLICRunLoop!
    var runTask: Task<Void, Never>!

    override func setUpWithError() throws {
        var clientInputStream: InputStream? = nil
        var serverOutputStream: OutputStream? = nil
        Stream.getBoundStreams(withBufferSize: 2000, inputStream: &clientInputStream, outputStream: &serverOutputStream)

        var serverInputStream: InputStream? = nil
        var clientOutputStream: OutputStream? = nil
        Stream.getBoundStreams(withBufferSize: 2000, inputStream: &serverInputStream, outputStream: &clientOutputStream)

        let clientIoQueue = DispatchQueue(label: "client io") as! DispatchSerialQueue
        let serverIoQueue = DispatchQueue(label: "server io") as! DispatchSerialQueue

        clientRunloop = QLICRunLoop(
            inputStream: clientInputStream!,
            outputStream: clientOutputStream!,
            ioQueue: clientIoQueue
        )
        serverRunloop = QLICRunLoop(
            isClient: false,
            inputStream: serverInputStream!,
            outputStream: serverOutputStream!,
            ioQueue: serverIoQueue
        )

        runTask = Task { [clientRunloop, serverRunloop] in
            do {
                try await withThrowingTaskGroup(of: Void.self) { group in
                    group.addTask {
                        do {
                            try await clientRunloop!.run()
                        } catch {
                            if !Task.isCancelled {
                                XCTFail("client runloop threw \(error)")
                            }
                        }
                    }
                    group.addTask {
                        do {
                            try await serverRunloop!.run()
                        } catch {
                            if !Task.isCancelled {
                                XCTFail("server runloop threw \(error)")
                            }
                        }
                    }
                    group.addTask {
                        do {
                            try await clientRunloop!.handshakeEngine.runClientHandshake(
                                authVerifiers: [UnauthenticatedAuthVerifier(identity: "server-identity")],
                                authProviders: [UnauthenticatedAuthProvider(identity: "client-identity")],
                                clientRandomOverride: Data(0 ..< 32),
                                keyAgreementOverride: .init(rawRepresentation: Data(0 ..< 48))
                            )
                            _ = try await clientRunloop!.handshakeEngine.receiveCryptoFrame()
                        } catch {
                            if !Task.isCancelled {
                                XCTFail("client handshake threw \(error)")
                            }
                        }
                    }
                    group.addTask {
                        do {
                            try await serverRunloop!.handshakeEngine.runUnauthenticatedServerHandshake(
                                authProvider: UnauthenticatedAuthProvider(identity: "server-identity"),
                                authVerifier: UnauthenticatedAuthVerifier(identity: "client-identity")
                            )
                            _ = try await serverRunloop!.handshakeEngine.receiveCryptoFrame()
                        } catch {
                            if !Task.isCancelled {
                                XCTFail("server handshake threw \(error)")
                            }
                        }
                    }

                    while !group.isEmpty {
                        try await group.next()
                    }
                }
            } catch {
                if !Task.isCancelled {
                    XCTFail("Threw \(error)")
                }
            }
        }
    }

    override func tearDown() async throws {
        runTask.cancel()
        await runTask.value
        clientRunloop = nil
        serverRunloop = nil
        runTask = nil
    }

    func untestRunloop() async throws {
        let clientStream = await clientRunloop.streamEngine.makeStream()
        try await clientStream.send(content: Data(count: 100))

        var serverStream: QLICStream!
        do {
            for await stream in await serverRunloop.streamEngine.incomingStreams.stream {
                serverStream = stream
                break
            }
        }

        guard
            case .success(Data(count: 100)) = await serverStream.receive(range: 100 ... 100)
        else {
            throw TestFailureError()
        }

        try await serverStream.send(content: Data(count: 50))
        guard
            case .success(Data(count: 50)) = await clientStream.receive(range: 50 ... 50)
        else {
            throw TestFailureError()
        }

        try await serverStream.send(content: Data(count: 100))
        await serverStream.closeForWriting()
        guard
            case .closed(Data(count: 100)) = await clientStream.receive(range: 200 ... 200)
        else {
            throw TestFailureError()
        }

        await clientStream.closeForWriting()
        guard
            case .closed(Data()) = await serverStream.receive(range: 200 ... 200)
        else {
            throw TestFailureError()
        }
    }
}

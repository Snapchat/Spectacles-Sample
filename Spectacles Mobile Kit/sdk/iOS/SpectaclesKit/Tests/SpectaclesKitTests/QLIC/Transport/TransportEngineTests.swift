// Copyright © 2024 Snap, Inc. All rights reserved.

@testable import SpectaclesKit
import XCTest

extension InputStream: @unchecked @retroactive Sendable {}
extension OutputStream: @unchecked @retroactive Sendable {}

final class TransportEngineTests: XCTestCase {
    let queue = DispatchQueue(label: "test runner") as! DispatchSerialQueue
    var readEngine: TransportReadEngine!
    var writeEngine: TransportWriteEngine!
    var runTask: Task<Void, Never>?

    override func setUpWithError() throws {
        var inputStream: InputStream? = nil
        var outputStream: OutputStream? = nil

        Stream.getBoundStreams(withBufferSize: 2000, inputStream: &inputStream, outputStream: &outputStream)
        readEngine = TransportReadEngine(stream: inputStream!, queue: queue)
        writeEngine = TransportWriteEngine(stream: outputStream!, queue: queue)
        runTask = Task { [readEngine, writeEngine] in
            async let readTask: Void = {
                do {
                    try await readEngine!.run()
                } catch {
                    if !Task.isCancelled {
                        XCTFail("Read engine threw \(error)")
                    }
                }
            }()
            async let writeTask: Void = {
                do {
                    try await writeEngine!.run()
                } catch {
                    if !Task.isCancelled {
                        XCTFail("Write engine threw \(error)")
                    }
                }
            }()
            _ = await (readTask, writeTask)
        }
    }

    override func tearDown() async throws {
        runTask?.cancel()
        await runTask?.value
        readEngine = nil
        writeEngine = nil
        runTask = nil
    }

    func testSmallCoalescedPackets() async throws {
        var sampleData = Data()
        for i in 0 ..< 100 {
            sampleData.append(0xA)
            sampleData.append(Data(repeating: UInt8(i), count: 10))
        }
        try await writeEngine.write(data: [sampleData])
        try await depleteReadStream(expected: sampleData.count)

        for i in 0 ..< 100 {
            let packet = try await readEngine.read()!
            XCTAssertEqual(packet.header, Data([0xA]))
            XCTAssertEqual(packet.payload, Data(repeating: UInt8(i), count: 10))
        }
    }

    func testLargeSplitPackets() async throws {
        let payload = Data((0 ..< 16384).map { _ in UInt8.random(in: 0 ..< UInt8.max) })

        // Test that it handles split packet headers correctly
        try await writeEngine.write(data: [Data([0x80, 0x00])])
        try await depleteReadStream(expected: 2)

        let expectation = try await readEngine.read() == nil
        XCTAssertTrue(expectation)

        // Now write the whole data. The buffer size is 2KB, so the stream is guaranteed to chunk it
        try await writeEngine.write(data: [Data([0x40, 0x00]), payload])
        try await depleteReadStream(expected: 2 + payload.count)

        let packet = try await readEngine.read()!
        XCTAssertEqual(packet.header, Data([0x80, 0x00, 0x40, 0x00]))
        XCTAssertEqual(packet.payload, payload)
    }

    func depleteReadStream(expected: Int) async throws {
        var expected = expected
        for await bytes in readEngine.bytesReadStream {
            expected -= bytes
            XCTAssert(expected >= 0)
            if expected == 0 { return }
        }
        throw CancellationError()
    }
}

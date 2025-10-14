// Copyright © 2024 Snap, Inc. All rights reserved.

import Combine
import CryptoKit
import Foundation
import SpectaclesKit
import UIKit

final class testAuthentication: Authentication {}

private let testLensId = "SpecsMobileKit"

final class Model: ObservableObject {
    var (deeplinkStream, deeplinkContinuation) = AsyncStream<URL>.makeStream()
    let bondingManager: any BondingManager
    var currentSession: SpectaclesSession?
    @Published var sessionStarted: Bool = false

    @Published var receivedMessage: String = ""
    var sendContinuation = PassthroughSubject<String, Never>()

    @Published var bondings: [BondingData] = []

    init() {
        bondingManager = BuilderFactory.create().setIdentifier(ClientIdentifier(clientId: Bundle.main.bundleIdentifier!, appName: "SampleApp")!).setVersion("1.0").setAuth(testAuthentication()).build()

        getAllBonding()
    }

    func pushDeeplinkURL(url: URL) {
        deeplinkContinuation.yield(url)
    }

    func getAllBonding() {
        self.bondings.removeAll()
        let bondings = bondingManager.availableBondings()
        for bonding in bondings {
            self.bondings.append(BondingData(id: bonding.id))
        }
    }

    func unbind(id: String) {
        Task { @MainActor in
            (deeplinkStream, deeplinkContinuation) = AsyncStream<URL>.makeStream()
            let result = await bondingManager.unbind(id: id, deeplinkAsyncStream: deeplinkStream)
            switch result {
            case .success:
                getAllBonding()
                print("[SampleApp] unbind:\(id)")
            case let .failure(error):
                print("[SampleApp] unbind error:\(error)")
            }
        }
    }

    func bind() {
        Task { @MainActor in
            (deeplinkStream, deeplinkContinuation) = AsyncStream<URL>.makeStream()

            // [WARNING] Since names are not unique, singleLensByLensName is for development use. Use singleLens in production for better security.
            // Using lensName is only intended for development when lensId is not yet known.
            let request = BondingRequest.singleLensByName(lensName: testLensId)
            // let request = BondingRequest.singleLens(lensId: testLensId) // preferred in production

            let result = await bondingManager.bind(request: request, deeplinkAsyncStream: deeplinkStream)
            switch result {
            case let .success(newBonding):
                getAllBonding()
                print("[SampleApp] newBonding:\(newBonding)")
            case let .failure(error):
                print("[SampleApp] bind error:\(error)")
            }
        }
    }

    func startSession(binding: any Bonding) {
        sendContinuation = PassthroughSubject<String, Never>()
        // set acceptUntrustedLenses to allow untrusted lens connections, When using singleLensByLensName.
        currentSession = try? bondingManager.createSession(bonding: binding, request: SessionRequest(autoReconnect: true, acceptUnfusedSpectacles: true, acceptUntrustedLenses: true), delegateBuilder: { _ in
            self
        })
        sessionStarted = true
    }

    func stopSession() {
        currentSession?.close(reason: nil)
        currentSession = nil
        sessionStarted = false
        receivedMessage = ""
    }
}

extension Model: SpectaclesRequestDelegate {
    func processServiceRequest(_ request: SpectaclesRequest) async {
        switch request {
        case let .api(apiRequest):
            switch apiRequest {
            case let .call(callRequest):
                Task { @MainActor in
                    self.onReceiveMessage(message: String(data: callRequest.params, encoding: .utf8)!)
                }
                let sendStream = makeStream()
                for await sendMessage in sendStream {
                    callRequest.yield(sendMessage.data(using: .utf8)!, isComplete: false)
                }

            case let .notify(notifyRequest):
                print("[SampleApp] \(notifyRequest)")
            }
        case let .asset(assetRequest):
            switch assetRequest {
            case let .load(asset): do {
                    print("[SampleApp] Load asset:\(asset)")
                    if let data = getData(from: asset.uri) {
                        let dataKey = data.sha256Hash()
                        asset.complete(returning: SpectaclesAssetRequest.Asset(name: dataKey, version: dataKey, data: data))
                    } else {
                        asset.complete(throwing: SpectaclesRequestError.notFound)
                    }
                }
            }
        }
    }

    @MainActor
    func onReceiveMessage(message: String) {
        receivedMessage = message
    }

    @MainActor
    func onSendMessage(message: String) {
        sendContinuation.send(message)
    }

    private func makeStream() -> AsyncStream<String> {
        AsyncStream { continuation in
            let subscription = sendContinuation.sink { value in
                continuation.yield(value)
            }
            continuation.onTermination = { _ in
                subscription.cancel()
            }
        }
    }
}

extension Data {
    func sha256Hash() -> String {
        let hash = SHA256.hash(data: self)
        return hash.map { String(format: "%02hhx", $0) }.joined()
    }
}

func getData(from input: String) -> Data? {
    guard let end = input.lastIndex(of: ".") else {
        return nil
    }

    let filePath = String(input[..<end])
    let fileExtension = String(input[input.index(after: end)...])

    print("[SampleApp] filePath:\(filePath) extension:\(fileExtension)")

    if fileExtension == "png" {
        return UIImage(named: filePath + "." + fileExtension)?.pngData()
    } else {
        guard let fileURL = Bundle.main.url(forResource: filePath, withExtension: fileExtension) else { return nil }
        return try? Data(contentsOf: fileURL)
    }
}

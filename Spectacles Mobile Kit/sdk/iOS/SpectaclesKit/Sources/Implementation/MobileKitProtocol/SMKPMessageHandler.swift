// Copyright © 2024 Snap, Inc. All rights reserved.
import Foundation

private let successStatus = 0

protocol SMKPMessageHandler {
    func handleMessage(_ message: SMKPMessage, _ path: String, _ stream: QLICStream) async throws
}

enum SMKPMessageHandlerFactory {
    static func generate(_ type: SMKPMessage.RequestType, _ delegate: any SpectaclesRequestDelegate) throws -> any SMKPMessageHandler {
        switch type {
        case .notify: SMKPNotifyRequestHandler(delegate: delegate)
        case .call: SMKPCallRequestHandler(delegate: delegate)
        case .download: SMKPAssetRequestHandler(delegate: delegate)
        case .attest: throw SMKPAttestRequestHandler.AttestationError.reattestationUnsupported
        }
    }
}

struct SMKPNotifyRequestHandler: SMKPMessageHandler {
    let delegate: any SpectaclesRequestDelegate
    struct NotifyRequest: SpectaclesApiNotifyRequestProtocol {
        let method: String = "GET"
        let params: Data
    }
    func handleMessage(_ message: SMKPMessage, _ path: String, _ stream: QLICStream) async throws {
        let notification = NotifyRequest(params: message.body)
        await delegate.processServiceRequest(.api(.notify(notification)))
    }
}

struct SMKPCallRequestHandler: SMKPMessageHandler {
    let delegate: any SpectaclesRequestDelegate

    struct CallRequest: SpectaclesApiCallRequestProtocol, SpectaclesApiNotifyRequestProtocol {
        let method: String = "GET"
        let params: Data

        let responses = AsyncThrowingStream<(value: Data, isComplete: Bool), any Error>.makeStream()

        func yield(_ value: Data, isComplete: Bool) {
            responses.continuation.yield((value, isComplete))
            if isComplete {
                responses.continuation.finish()
            }
        }

        func finish(throwing error: SpectaclesRequestError) {
            responses.continuation.finish(throwing: error)
        }
    }

    func handleMessage(_ message: SMKPMessage, _ path: String, _ stream: QLICStream) async throws {
        let call = CallRequest(params: message.body)
        async let _: Void = await delegate.processServiceRequest(.api(.call(call)))
        for try await response in call.responses.stream {
            let message = SMKPMessage(
                startLine: .response(type: .response, status: successStatus),
                header: nil,
                body: response.value
            )
            Log.print("[streamId]:\(stream.streamId) send:\(message)")
            try await stream.send(content: message.encode())

            if response.isComplete {
                return
            }
        }
    }
}

struct SMKPAssetRequestHandler: SMKPMessageHandler {
    let delegate: any SpectaclesRequestDelegate

    private let versionKey = "v"
    private let totalSizeKey = "s"

    private let fileNotModifiedStatus = 304
    private let fileNotFoundStatus = 404

    struct AssetRequest: SpectaclesLoadAssetRequest, CustomStringConvertible {
        let uri: String
        let version: String?

        let response = AsyncStream<Result<Payload, SpectaclesRequestError>>.makeStream()

        func complete(with result: Result<Payload, SpectaclesRequestError>) {
            response.continuation.yield(result)
            response.continuation.finish()
        }

        var description: String {
            return "(uri: \(uri), version: \(String(describing: version)))"
        }
    }

    func handleMessage(_ message: SMKPMessage, _ path: String, _ stream: QLICStream) async throws {
        let version = message.header?.getHeaderStringValue(versionKey)
        let asset = AssetRequest(uri: path, version: version)
        async let _: Void = await delegate.processServiceRequest(.asset(.load(asset)))
        for await response in asset.response.stream {
            switch response {
            case let .success(success):
                var header = SMKPMessageHeader()
                header.setHeaderStringValue(versionKey, value: success.version!)
                // TODO: chunk data support
                // TODO: update to date support
                header.setHeaderIntValue(totalSizeKey, value: success.data.count)
                let message = SMKPMessage(
                    startLine: .response(type: .response, status: successStatus),
                    header: header,
                    body: success.data
                )
                try await stream.send(content: message.encode())
            case .failure:
                var header = SMKPMessageHeader()
                header.setHeaderIntValue(totalSizeKey, value: 0)
                let message = SMKPMessage(
                    startLine: .response(type: .response, status: fileNotFoundStatus),
                    header: nil,
                    body: Data()
                )
                try await stream.send(content: message.encode())
            }
        }
    }
}

struct SMKPAttestRequestHandler {
    enum AttestationError: Error {
        case missingHeaderToken
        case reattestationUnsupported
        case lensIdMismatch
        case lensTokenMismatch
        case attestationIncomplete
    }

    struct Body: Codable {
        let lensId: String
        let lensVersion: String?
        let creator: String?
        let source: String?

        enum CodingKeys: String, CodingKey {
            case lensId = "lens-id"
            case lensVersion = "lens-version"
            case creator
            case source
        }
    }

    let expectedLensId: String
    let acceptUntrustedLenses: Bool
    var lensToken: String?

    mutating func handleFirstMessage(_ message: SMKPMessage) throws -> Bool {
        guard let messageLensToken = message.header?.getHeaderStringValue("t") ?? message.header?.getHeaderStringValue("lens-token") else {
            throw AttestationError.missingHeaderToken
        }
        if case .request(.attest, _) = message.startLine {
            guard lensToken == nil else { throw AttestationError.reattestationUnsupported }
            lensToken = messageLensToken
            let decoder = JSONDecoder()
            decoder.keyDecodingStrategy = .convertFromSnakeCase
            let body = try decoder.decode(Body.self, from: message.body)
            if body.lensId.caseInsensitiveCompare(expectedLensId) != .orderedSame {
                if acceptUntrustedLenses {
                    Log.notice("[SMKP] Session configured to accept untrusted lenses. Ignoring lens id mismatch \(expectedLensId) vs \(body.lensId)")
                } else {
                    Log.error("[SMKP] Attestation request has wrong lens id: \(expectedLensId) vs \(body.lensId)")
                    throw AttestationError.lensIdMismatch
                }
            }
            return true
        } else {
            guard let lensToken else {
                Log.error("[SMKP] Received \(message) before lens attestation complete")
                throw AttestationError.attestationIncomplete
            }
            guard lensToken == messageLensToken else {
                Log.error("[SMKP] Lens token changed mid-session: \(lensToken) vs \(messageLensToken)")
                throw AttestationError.lensTokenMismatch
            }
            return false
        }
    }
}

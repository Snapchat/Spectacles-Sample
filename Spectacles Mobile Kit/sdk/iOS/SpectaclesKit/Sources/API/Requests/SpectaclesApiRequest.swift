// Copyright © 2024 Snap, Inc. All rights reserved.

public import Foundation

// MARK: - SpectaclesApiRequest Enum

public enum SpectaclesApiRequest: Sendable {
    public protocol RequestProtocol: SpectaclesRequest.RequestProtocol {
        var method: String { get }
        var params: Data { get }
    }

    case call(any SpectaclesApiCallRequestProtocol)
    case notify(any SpectaclesApiNotifyRequestProtocol)

    public var underlyingRequest: any RequestProtocol {
        switch self {
        case let .call(request):
            return request
        case let .notify(request):
            return request
        }
    }
}

public protocol SpectaclesApiCallRequestProtocol: SpectaclesApiRequest.RequestProtocol, SpectaclesRequestWithStreamResponseProtocol where Payload == Data {}

public protocol SpectaclesApiNotifyRequestProtocol: SpectaclesApiRequest.RequestProtocol, SpectaclesRequestWithoutResponseProtocol {}

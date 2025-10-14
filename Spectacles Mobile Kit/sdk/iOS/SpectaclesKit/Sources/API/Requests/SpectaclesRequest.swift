// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Top level request made by Spectacles.

 This SDK uses a series of request enums and protocols to define requests in a structured manner. Each request enum contains a corresponding `RequestProtocol` that each sub-request type conforms to. This protocol contains any members that are common to all the sub-request types. Request enums also expose an `underlyingRequest` method that can be used to extract their payloads as the `RequestProtocol`.
 */
public enum SpectaclesRequest: Sendable {
    public protocol RequestProtocol: Sendable {}

    case api(SpectaclesApiRequest)
    case asset(SpectaclesAssetRequest)

    public var underlyingRequest: any RequestProtocol {
        switch self {
        case let .api(request):
            return request.underlyingRequest
        case let .asset(request):
            return request.underlyingRequest
        }
    }
}

public protocol SpectaclesRequestWithResponseProtocol<Payload>: SpectaclesRequest.RequestProtocol {
    associatedtype Payload: Sendable
    func complete(with result: Result<Payload, SpectaclesRequestError>)
}

extension SpectaclesRequestWithResponseProtocol {
    public func complete(returning value: Payload) {
        complete(with: .success(value))
    }
    public func complete(throwing error: SpectaclesRequestError) {
        complete(with: .failure(error))
    }
}

public protocol SpectaclesRequestWithStreamResponseProtocol<Payload>: SpectaclesRequest.RequestProtocol {
    associatedtype Payload: Sendable
    func yield(_ value: Payload, isComplete: Bool)
    func finish(throwing error: SpectaclesRequestError)
}

public protocol SpectaclesRequestWithoutResponseProtocol: SpectaclesRequest.RequestProtocol {}

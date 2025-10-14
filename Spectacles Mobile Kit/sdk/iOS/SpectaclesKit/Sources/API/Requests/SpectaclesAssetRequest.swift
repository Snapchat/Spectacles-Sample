// Copyright © 2024 Snap, Inc. All rights reserved.

public import Foundation

public enum SpectaclesAssetRequest: Sendable {
    /// A structure representing an asset with associated data.
    ///
    /// - Parameters:
    ///   - name: The name of the asset.
    ///   - version: Identifies a unique version of the asset, if available. This can be either a
    ///     file checksum or a file timestamp, as determined by the SDK or Lens developer. Pass `nil`
    ///     to retrieve the most recent asset content.
    ///   - data: The raw data associated with the asset.
    public struct Asset: Sendable {
        public var name: String
        public var version: String?
        public var data: Data

        public init(name: String, version: String? = nil, data: Data) {
            self.name = name
            self.version = version
            self.data = data
        }
    }

    public protocol RequestProtocol: SpectaclesRequest.RequestProtocol {}

    case load(any SpectaclesLoadAssetRequest)

    public var underlyingRequest: any RequestProtocol {
        switch self {
        case let .load(request):
            return request
        }
    }
}

public protocol SpectaclesLoadAssetRequest: SpectaclesAssetRequest.RequestProtocol, SpectaclesRequestWithResponseProtocol where Payload == SpectaclesAssetRequest.Asset {
    var uri: String { get }
    var version: String? { get }
}

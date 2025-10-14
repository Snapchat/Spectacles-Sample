// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

// MARK: - SpectaclesRequestDelegate Protocol

public protocol SpectaclesRequestDelegate: AnyObject, Sendable {
    func processServiceRequest(_ request: SpectaclesRequest) async
}

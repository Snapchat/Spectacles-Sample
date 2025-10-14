// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/// Constants describing the L2CAP bandwidth
enum L2CAPMTU {
    /// Maximum L2CAP MTU size
    static let max = 64 * 1024 // 64 KB
    /// Expected L2CAP MTU size
    static let expected = 3 * 512 // 1.5 KB
}

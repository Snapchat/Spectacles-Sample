// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/// Wrapper providing bitfield access helpers for the stream id
struct StreamId {
    /// Raw value of the stream id as an integer
    var rawValue: Int

    /// Whether the stream id is for a client initiated stream or not
    var isClientInitiated: Bool {
        get {
            rawValue & 0x1 != 0 // Return true when the the least significant bit(LSB) is 1
        }
        set {
            if newValue {
                rawValue = rawValue | 0x1 // Set the LSB to 1
            } else {
                rawValue = rawValue & ~0x1 // Clear the LSB to 0
            }
        }
    }

    /// Incrementing counter portion of the stream id
    var counter: Int {
        get {
            rawValue >> 1
        }
        set {
            rawValue = (newValue << 1) | (rawValue & 0x1)
        }
    }

    init(counter: Int, isClientInitiated: Bool) {
        self.rawValue = 0
        self.counter = counter
        self.isClientInitiated = isClientInitiated
    }

    init(rawValue: Int) {
        self.rawValue = rawValue
    }
}

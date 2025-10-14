// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/// A partially read byte buffer.
struct PartialData {
    /// The partially read data
    var data = Data()
    /// The total expected size of the data
    var totalCount = 0

    /// Copies bytes from a buffer until either the buffer is empty or the partial data is complete
    mutating func consumeBytes(from slice: inout Data) {
        let bytesToRead = min(totalCount - data.count, slice.count)
        data += try! slice.dequeueData(count: bytesToRead)
    }

    /// Sets the data's total count
    mutating func setTotalCount(_ totalCount: Int) {
        self.totalCount = totalCount
        data.reserveCapacity(totalCount)
    }

    /// Resets the partial data to empty
    mutating func reset() {
        data = Data()
        totalCount = 0
    }

    /// Whether the partial data is empty
    var isEmpty: Bool { data.count == 0 }

    /// Whether the partial data has been fully read
    var isComplete: Bool { data.count == totalCount }
}

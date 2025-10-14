// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Protocol wrapping task sleep methods

 Used so that we can unit test timeout based logic without actually needing to wait for the timeouts to expire.
 */
protocol ClockProtocol: Sendable {
    /// Current time
    var now: TimeInterval { get }

    /// Sleeps until a certain deadline is reached
    func sleep(until deadline: TimeInterval) async throws
}

/// Clock implementation that uses `mach_absolute_time` for timing
struct MachAbsoluteClock: ClockProtocol {
    /// Constant for converting mach time units to seconds
    private static let machTimescaleToSeconds = {
        var timebase_info = mach_timebase_info()
        mach_timebase_info(&timebase_info)
        return Double(timebase_info.numer) / Double(timebase_info.denom) / Double(NSEC_PER_SEC)
    }()

    /// Current time
    var now: TimeInterval {
        Double(mach_absolute_time()) * Self.machTimescaleToSeconds
    }

    /// Sleeps until a deadline is reached
    func sleep(until deadline: TimeInterval) async throws {
        let timeout = deadline - now
        if timeout > 0 {
            let timeoutNs = UInt64(Double(NSEC_PER_SEC) * timeout)
            try await Task.sleep(nanoseconds: timeoutNs)
        }
    }
}

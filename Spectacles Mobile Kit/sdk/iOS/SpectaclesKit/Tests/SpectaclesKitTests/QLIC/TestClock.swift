// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation
@testable import SpectaclesKit

/// Implementation of clock protocol used for unit tests
struct TestClock: ClockProtocol {
    struct State {
        var now: TimeInterval = 0
        var waiters = [(deadline: TimeInterval, continuation: AsyncStream<Void>.Continuation)]()
    }

    let state = Lock(initialState: State())

    var now: TimeInterval {
        get {
            state.withLock(\.now)
        }
        set {
            let continuations = state.withLock {
                $0.now = newValue
                let ret = $0.waiters.filter { $0.deadline <= newValue }.map(\.continuation)
                $0.waiters = $0.waiters.filter { $0.deadline > newValue }
                return ret
            }
            for continuation in continuations {
                continuation.yield()
            }
        }
    }

    func sleep(until deadline: TimeInterval) async throws {
        let stream = AsyncStream { continuation in
            state.withLock {
                if deadline <= $0.now {
                    continuation.yield()
                } else {
                    $0.waiters.append((deadline, continuation))
                }
            }
        }
        for await _ in stream {
            return
        }
        throw CancellationError()
    }
}

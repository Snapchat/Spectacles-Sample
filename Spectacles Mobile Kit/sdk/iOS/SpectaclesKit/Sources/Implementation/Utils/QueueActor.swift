// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Protocol containing helper methods to use a queue as an actor's serial executor
 */
protocol QueueActor: Actor, SerialExecutor {
    /// The dispatch queue on which to run all operations
    nonisolated var queue: DispatchSerialQueue { get }
}

extension QueueActor {
    nonisolated func enqueue(_ job: UnownedJob) {
        queue.async { [unownedExecutor] in
            job.runSynchronously(on: unownedExecutor)
        }
    }
    nonisolated func asUnownedSerialExecutor() -> UnownedSerialExecutor {
        UnownedSerialExecutor(ordinary: self)
    }
    nonisolated var unownedExecutor: UnownedSerialExecutor { asUnownedSerialExecutor() }
}

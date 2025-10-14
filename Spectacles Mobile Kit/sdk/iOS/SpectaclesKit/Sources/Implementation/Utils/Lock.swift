// Copyright © 2024 Snap, Inc. All rights reserved.

import os

import Synchronization

/**
 Lightweight lock implementation.

 Included because `OSAllocatedUnfairLock` requires iOS 16, and `Mutex` requires iOS 18. Uses a `ManagedBuffer` for underlying storage to avoid two memory allocations.
 */
struct Lock<State>: @unchecked Sendable {
    private final class Storage: ManagedBuffer<State, os_unfair_lock> {
        static func create(initialState: State) -> Storage {
            let ret = Storage.create(minimumCapacity: 1) { _ in
                initialState
            }
            ret.withUnsafeMutablePointerToElements { lock in
                lock.initialize(to: .init())
            }
            return ret as! Storage
        }

        deinit {
            _ = withUnsafeMutablePointerToElements { lock in
                lock.deinitialize(count: 1)
            }
        }
    }
    private let storage: Storage

    init(initialState: State) {
        self.storage = .create(initialState: initialState)
    }

    func withLock<R: Sendable>(_ body: @Sendable (inout State) throws -> R) rethrows -> R {
        try storage.withUnsafeMutablePointerToElements { lock in
            os_unfair_lock_lock(lock)
            defer { os_unfair_lock_unlock(lock) }
            return try body(&storage.header)
        }
    }
}

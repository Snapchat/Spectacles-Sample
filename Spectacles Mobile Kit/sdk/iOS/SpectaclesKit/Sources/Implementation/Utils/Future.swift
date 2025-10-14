// Copyright © 2025 Snap, Inc. All rights reserved.

/*
 Lightweight lock-based future implementation.

 `UnsafeContinuation` can be difficult to use correctly from actor-isolated contexts, so we add a wrapper that lets us defer the creation of the continuation until after we've updated the actor state.
 */

struct Future<T: Sendable>: Sendable {
    fileprivate typealias Continuation = UnsafeContinuation<T, Never>

    fileprivate enum State {
        case waiting([Continuation])
        case yielded(T)
    }

    private let lock = Lock(initialState: State.waiting([]))

    struct Promise {
        fileprivate let lock: Lock<State>

        func complete(returning value: T) {
            let continuations = lock.withLock { state in
                defer { state = .yielded(value) }
                if case let .waiting(continuations) = state {
                    return continuations
                } else {
                    return []
                }
            }
            for continuation in continuations {
                continuation.resume(returning: value)
            }
        }
    }

    init(_ build: (Promise) -> Void) {
        build(Promise(lock: lock))
    }

    var value: T {
        get async {
            await withUnsafeContinuation { continuation in
                lock.withLock { state in
                    switch state {
                    case var .waiting(continuations):
                        continuations.append(continuation)
                        state = .waiting(continuations)
                    case let .yielded(result):
                        continuation.resume(returning: result)
                    }
                }
            }
        }
    }
}

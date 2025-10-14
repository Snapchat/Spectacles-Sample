// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Exposes CoreFoundation APIs for dispatch queue based scheduling of streams. Also provides namespaced errors.
 */
extension Stream {
    /// Thrown for subclasses of `Stream` that don't support dispatch queue based scheduling.
    struct QueueUnsupportedError: Error {
        let streamType: Stream.Type
    }

    /// Thrown when encountering an unexpected stream event
    enum UnexpectedError: Error {
        case unexpectedStatus(Stream.Status)
        case unexpectedEvent(Stream.Event)
    }

    /**
     Specify the dispatch queue upon which delegate methods will be invoked.
     Passing `NULL` will prevent future delegate methods from being invoked.
     */
    @objc
    func setQueue(_ queue: DispatchSerialQueue?) throws {
        throw QueueUnsupportedError(streamType: Self.self)
    }
}

extension InputStream {
    override func setQueue(_ queue: DispatchSerialQueue?) throws {
        CFReadStreamSetDispatchQueue(self, queue)
    }
}

extension OutputStream {
    override func setQueue(_ queue: DispatchSerialQueue?) throws {
        CFWriteStreamSetDispatchQueue(self, queue)
    }
}

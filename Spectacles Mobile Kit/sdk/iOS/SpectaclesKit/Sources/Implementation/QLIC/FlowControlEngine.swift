// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Handles flow control for the QLIC protocol.

 The flow control engine uses a credit-based mechanism to decide when sending packets is permitted, and how large those packets should be. It is also responsible for sending and handling `ack` and `ping` frames, and for tracking timeouts for sent packets.
 */
struct FlowControlEngine<Clock: ClockProtocol> {
    /// Struct containing info about a sent packet
    private struct PacketInfo {
        /// How many bytes need to be acknowledged to ack this packet
        var unackedBytes: Int
        /// When the packet was sent
        let sendTimestamp: TimeInterval
        /// Any ack metadata from the stream engine
        let streamAckMetadata: StreamEngine.AckMetadata?
    }

    // TODO: Dynamically update transmit size estimate based on read and ack timestamps
    /**
     Estimated number of bytes that can be sent per connection interval.

     This initial estimate is based on observations that Spectacles and iOS will typically exchange 10x 251 byte LL packets per connection interval. Subtracting the 4 byte L2CAP header gives us a transmit size of 2506 bytes.
     */
    private var estimatedTransmitSize = 2506

    /// How many bytes the read engine has read that haven't been processed by the runloop as a packet yet.
    private var readEngineQueuedBytes = 0

    /**
     How many bytes would need to be ack'd to acknowledge the most recently read packet

     For transmit-size discovery purposes, we acknowledge all bytes read from the peer, even those from partially-read packets. In those cases, this count may be negative
     */
    private var unackedReadBytes = 0

    /// How many bytes would need to be ack'd to acknowledge the most recently written packet
    private var unackedWriteBytes = 0

    /**
     Number of bytes sent in ack-eliding packets since the last ack-soliciting packet

     Sending a large number of consecutive ack-eliding packets exhausts the flow control credit and hampers future TX performance. To avoid this, we track then number of consecutive ack-eliding bytes, and send a `ping` once it reaches a certain threshold.
     */
    private var ackElidingBytes = 0

    /// Whether we have recently received frames that require an acknowledgement
    private var hasSolictedAck = false

    /// Information about unacknowledged packets
    private var unackedPacketInfo = [PacketInfo]()

    /// The clock to use for timeout operations
    private let clock: Clock

    /// How often we should send keep alives to verify that the connection is still active
    private let keepAliveInterval: TimeInterval = 30

    /// Maximum time that we should wait for an ack before assuming a disconnection
    private let ackTimeout: TimeInterval = 5

    /// Timestamp of the last packet received.
    private var lastPacketTimestamp: TimeInterval

    /// Task waiting for the next timeout event
    private var timeoutTask: Task<Void, any Error>?

    /// Current deadline that the timeout task is waiting for
    private var currentDeadline: TimeInterval?

    /// Signal for the runloop to process flow control tx events
    private let txSignal: AsyncStream<Void>.Continuation

    init(clock: Clock, txSignal: AsyncStream<Void>.Continuation) {
        self.clock = clock
        self.txSignal = txSignal
        self.lastPacketTimestamp = clock.now
    }

    // MARK: - Timeouts

    /**
     Schedules the runloop to later check the flow control engine for new frames

     Emits a signal 30s after the last received packet so that we can send a keep-alive ping, and emits a signal 5s after sending ack-soliciting packets so we can check that the packets have been acked.
     */
    private mutating func resetTimeoutTask() {
        var deadline = lastPacketTimestamp + keepAliveInterval
        if let info = unackedPacketInfo.first {
            deadline = min(deadline, info.sendTimestamp + ackTimeout)
        }
        guard deadline > clock.now, deadline != currentDeadline else { return }

        timeoutTask?.cancel()
        timeoutTask = Task { [clock, txSignal] in
            try await clock.sleep(until: deadline)
            txSignal.yield()
        }
        currentDeadline = deadline
    }

    /// Returns whether we have any ack-solicting packets that have timed out before receiving an ack.
    func hasReachedAckTimeout() -> Bool {
        /* Uncomment for M3 e2e test */
//        guard let info = unackedPacketInfo.first else { return false }
//        return clock.now - info.sendTimestamp >= ackTimeout
        return false
    }

    // MARK: - Event handling

    /// Called when the underlying stream reads bytes from the OS.
    mutating func onRawBytesRead(count: Int) {
        readEngineQueuedBytes += count
    }

    /// Called when a packet is read from the underlying stream.
    mutating func onPacketRead(count: Int) {
        lastPacketTimestamp = clock.now
        readEngineQueuedBytes -= count
        unackedReadBytes += count
        resetTimeoutTask()
    }

    /// Called when any ack soliciting frame is read.
    mutating func onAckSolicitingFrame() {
        hasSolictedAck = true
    }

    /// Called when an ack frame is received, returning the metadata of newly ack'd stream frames
    mutating func onAckFrame(bytesSinceLastAck: Int) -> [StreamEngine.AckMetadata] {
        unackedWriteBytes -= bytesSinceLastAck
        var newlyAckedPacketCount = 0
        for i in 0 ..< unackedPacketInfo.count {
            if unackedPacketInfo[i].unackedBytes <= bytesSinceLastAck {
                newlyAckedPacketCount += 1
            } else {
                unackedPacketInfo[i].unackedBytes -= bytesSinceLastAck
            }
        }
        let ret = unackedPacketInfo[0 ..< newlyAckedPacketCount].compactMap(\.streamAckMetadata)
        unackedPacketInfo.removeFirst(newlyAckedPacketCount)
        resetTimeoutTask()
        return ret
    }

    // MARK: - Packet sending

    /**
     Returns how large the next packet should be, or 0 if no packet should be sent.

     Packet sizes are chosen to be in the range `(0.5*estimatedTransitSize) ..< estimatedTransitSize` such that after a packet is written, the new number of unacknowledged bytes will be a multiple of `0.5*estimatedTransitSize`. The maximum number of unacknowledged bytes is chosen to be `2*estimatedTransitSize`.

     For example, with `estimatedTransitSize = 1000` and 250 unacked bytes, we send one 750 byte packet followed by two 500 byte packets. With 1000 unacked bytes, we send two 500 byte packets. With 1750 unacked bytes, we pause sending until we receive another ack.
     */
    var nextPacketSize: Int {
        estimatedTransmitSize / 2
        /* Uncomment for M3 e2e test */
//        let remainingCredit = 2 * estimatedTransmitSize - unackedWriteBytes
//        guard remainingCredit >= estimatedTransmitSize / 2 else { return 0 }
//        return remainingCredit % (estimatedTransmitSize / 2) + estimatedTransmitSize / 2
    }

    /// Returns an ack frame to send, if one has been solicited
    mutating func dequeueAckFrame() -> QLICFrame? {
        guard hasSolictedAck else { return nil }
        let ret = QLICFrame.ack(bytesSinceLastAck: unackedReadBytes + readEngineQueuedBytes)
        unackedReadBytes = -readEngineQueuedBytes
        hasSolictedAck = false
        return ret
    }

    /**
     Returns whether the next packet needs to solicit an ack

     When true, and no other ack-soliciting frames are being sent in the next packet, the runloop should add a ping frame to force the packet to be ack-soliciting.
     */
    var shouldSolicitAck: Bool {
        if ackElidingBytes >= estimatedTransmitSize / 2 {
            return true
        }
        if clock.now - lastPacketTimestamp >= keepAliveInterval, unackedPacketInfo.isEmpty {
            return true
        }
        return false
    }

    /**
     Called when a packet is written to the underlying stream
     - parameter isAckSoliciting: Whether this packet should trigger an immediate acknowledgement
     - parameter count: The total size of the packet in bytes
     - parameter ackMetadata: Any ack metadata provided by the stream engine for this packet
     */
    mutating func onPacketWritten(isAckSoliciting: Bool, count: Int, ackMetadata: StreamEngine.AckMetadata?) {
        unackedWriteBytes += count

        if isAckSoliciting {
            unackedPacketInfo.append(PacketInfo(
                unackedBytes: unackedWriteBytes,
                sendTimestamp: clock.now,
                streamAckMetadata: ackMetadata
            ))
            ackElidingBytes = 0
            resetTimeoutTask()
        } else {
            ackElidingBytes += count
        }
    }
}

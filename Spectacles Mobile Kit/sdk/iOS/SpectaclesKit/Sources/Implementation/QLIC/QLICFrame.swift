// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Frames that can be sent by the QLIC protocol.
 */
enum QLICFrame: Equatable {
    /**
     Semantically meaningless padding used to increase the size of packets.

     Used for bandwidth measurement, or to provide protection against traffic analysis.
     */
    case padding

    /**
     Requests acknowledgement of received data.
     */
    case ping

    /**
     Contains a count of received bytes.

     Byte counts for ack frames are based on the total number of bytes received from the OS layer at a given time before decryption or parsing have taken place. This allows ack frames to be used for stream-level acknowledgements, keep-alives, and bandwidth measurement.
     */
    case ack(bytesSinceLastAck: Int)

    /**
     Sent to abruptly terminate the sending part of the stream.

     After sending this frame, the local peer must no longer send new stream frames. The remote peer may discard any data that it has already received.
     */
    case resetStream(streamId: Int, applicationErrorCode: Int)

    /**
     Sent to abruptly terminate the receiving part of the stream.

     After sending this frame, the local peer should discard both new and  previously received stream data.

     If the remote peer has already sent its final stream frame, it must ignore this frame. Otherwise, it must respond with a `resetStream` frame containing the same application error code.
     */
    case stopSending(streamId: Int, applicationErrorCode: Int)

    /**
     Contains cryptographic handshake data.

     See ``HandshakeEngine`` for handshake details
     */
    case crypto(cryptoData: Data)

    /**
     Frames that implicitly create streams and carry stream data.

     Streams are created implicitly when a stream frame is received with a given stream id, and are closed explicitly by sending a frame with `fin = true`.
     */
    case stream(streamId: Int, streamData: Data, fin: Bool, endsOnMessageBoundary: Bool)

    /**
     Signals that the a protocol error has closed the connection.

     After sending this frame, peers should wait a small amount of time before closing the underlying transport to ensure delivery of the close frame. Receivers are free to immediately close the underlying transport upon receipt of this frame.
     */
    case protocolConnectionClose(protocolErrorCode: Int, frameType: Int, reason: Data)

    /**
     Signals that an application error has closed the connection.

     After sending this frame, peers should wait a small amount of time before closing the underlying transport to ensure delivery of the close frame. Receivers are free to immediately close the underlying transport upon receipt of this frame.
     */
    case applicationConnectionClose(applicationErrorCode: Int, reason: Data)

    /**
     Whether this frame type triggers an immediate acknowledgement.

     Ack, padding, and connection close frames do not themselves trigger an immediate acknowledgement, and are referred to as ack-eliding frames. All other frames trigger an immediate acknowledgement, and are referred to as ack-soliciting frames.

     A packet containing only ack-eliding frames is an ack-eliding packet, while a packet containing at least one ack-soliciting frame is an ack-soliciting packet.
     */
    var isAckSoliciting: Bool {
        switch self {
        case .ping, .resetStream, .stopSending, .crypto, .stream:
            return true
        case .padding, .ack, .protocolConnectionClose, .applicationConnectionClose:
            return false
        }
    }

    /**
     Whether this frame contains app data that might require a secure connection

     Before the handshake is complete and the peer identity is verified, stream-related frames cannot be sent or received.
     */
    var hasAppData: Bool {
        switch self {
        case .ping, .crypto, .padding, .ack, .protocolConnectionClose, .applicationConnectionClose:
            return false
        case .stream, .resetStream, .stopSending:
            return true
        }
    }
}

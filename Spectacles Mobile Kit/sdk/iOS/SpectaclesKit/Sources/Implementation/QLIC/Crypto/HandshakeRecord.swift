// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Records used by the crypto handshake algorithm to set up the secure encrypted channel

 These records behave identically to the TLS handshake records, with the AuthenticationShare record being analagous to the Certificate record, and the AuthenticationVerify record being analgous to the CertificateVerify record. For reference, the handshake proceeds as follows:

 The client begins with the ClientHello.

 The server responds with the ServerHello, the AuthenticationShare, the AuthenticationVerify, and the Finished records.

 The client processes those records, and finally responds with its own AuthenticationShare, AuthenticationVerify, and Finished record. This completes the handshake.
 */
enum HandshakeRecord: Equatable {
    /**
     Initial record sent from client to server.
     - parameters:
        - clientRandom: 32 byte random nonce
        - keyShare: An P384 key exchange public key
        - clientAuthenticationAlgorithms: List of authentication algorithms the client is able to perform
        - serverAuthenticationAlgorithms: List of authentication algorithms the client is able to verify
     */
    case clientHello(
        clientRandom: Data,
        keyShare: Data,
        clientAuthenticationAlgorithms: [AuthenticationAlgorithm],
        serverAuthenticationAlgorithms: [AuthenticationAlgorithm]
    )

    /**
     Server's response to the ClientHello
     - parameters:
        - serverRandom: 32 byte random nonce
        - keyShare: An P384 key exchange public key
     */
    case serverHello(
        serverRandom: Data,
        keyShare: Data
    )

    /**
     Record containing the encryption algorithms that the server has selected for use.
     - parameters:
        - clientAlgorithmIndex: Index of the authentication algorithm in the ClientHello's `clientAuthenticationAlgorithms` array that the client should use to authenticate to the server.
        - serverAlgorithmIndex: Index of the authentication algorithm in the ClientHello's `serverAuthenticationAlgorithms` array that the server will use to authenticate to the client.

     The authentication algorithm array indices are 1-based, and not 0-based. A value of 0 indicates that the server does not support any of the authentication algorithms that the client provides, and will be used in the future to add support for HelloRetryRequest and HelloRetry records.
     */
    case authenticationRequest(clientAlgorithmIndex: Int, serverAlgorithmIndex: Int)

    /**
     Record containing a peer's signing identity, and proof that the identity is genuine
     - parameter shareData: Algorithm-specific share data
     */
    case authenticationShare(shareData: AuthenticationShareData)

    /**
     Record containing a signature of the transcript hash using the peer's signing identity
     - parameter signature: Signature of the hash of all previously sent and received records using the peer's signing private key.
     */
    case authenticationVerify(signature: Data)

    /**
     Record indicating that a peer has updated the key it uses to encrypted outgoing traffic.
     - parameter updateRequested: If true, then the recipient should also update their tx key, and issue its own KeyUpdate.
     */
    case keyUpdate(updateRequested: Bool)
}

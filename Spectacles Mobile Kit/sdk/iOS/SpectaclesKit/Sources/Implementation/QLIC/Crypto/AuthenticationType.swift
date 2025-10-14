// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Authentication algorithms that can be used to verify peers
 */
enum AuthenticationAlgorithm: Equatable {
    /**
     Authenticate using a signing identity that was verified as genuine in a prior connection
     */
    case pretrusted(publicKey: Data)
    /**
     Authenticate using the iOS `DeviceCheck` framework
     */
    case iosDeviceCheck
    /**
     Authenticate using a x509 cert that chains up to the Spectacles root cert
     */
    case x509Cert

#if DEBUG
    /**
     Use encryption, but skip authentication
     */
    case unauthenticated
#endif
}

/**
 Data sent in the AuthenticationShare record to provide a signing identity and prove that it is genuine.
 */
enum AuthenticationShareData: Equatable {
    /**
     Empty share data, as the signing identity is already trusted
     */
    case pretrusted
    /**
     iOS specific attestation data
     */
    case iosDeviceCheck(publicKey: Data, attestationObject: Data)
    /**
     X509 certificates up to and including the Spectacles root cert.
     */
    case x509Cert(certChain: [Data])

#if DEBUG
    /**
     The unauthenticated identity string to use. Peer should accept any 32 byte signature for the verify data
     */
    case unauthenticated(identity: String)
#endif
}

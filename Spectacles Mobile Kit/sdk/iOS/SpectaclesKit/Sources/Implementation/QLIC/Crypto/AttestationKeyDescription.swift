// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/**
 Content of an attestation extension, used for attesting public keys on Android

 The attestation certificate extension has OID 1.3.6.1.4.1.11129.2.1.17, the full schema of which can be found at https://source.android.com/docs/security/features/keystore/attestation#attestation-extension
 */
struct KeyDescription {
    /**
     Security level of the relevant keystore element on Android

     See https://source.android.com/docs/security/features/keystore/attestation#securitylevel-values
     */
    enum SecurityLevel: UInt8 {
        case software = 0
        case trustedEnvironment = 1
        case strongBox = 2
    }

    /**
     Boot state of the Android device

     See https://source.android.com/docs/security/features/keystore/attestation#verifiedbootstate-values
     */
    enum VerifiedBootState: UInt8 {
        case verified = 0
        case selfSigned = 1
        case unverified = 2
        case failed = 3
    }

    /// Security level of the location where the attested key is stored
    let attestationSecurityLevel: SecurityLevel
    /// Security level of the keymint implementation
    let keyMintSecurityLevel: SecurityLevel
    /// Challenge data provided at key generation time
    let attestationChallenge: Data

    /// Whether the device's bootloader is locked
    let deviceLocked: Bool
    /// The device's boot state
    let bootState: VerifiedBootState
}

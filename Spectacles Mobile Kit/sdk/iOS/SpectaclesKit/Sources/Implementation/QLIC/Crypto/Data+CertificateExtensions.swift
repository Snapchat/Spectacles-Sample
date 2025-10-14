// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation

extension Data {
    /// Parses the attestation extension from X509-encoded certificate data
    func getAttestationKeyDescription() throws -> KeyDescription? {
        let objectIdentifier = Data([0x2B, 0x06, 0x01, 0x04, 0x01, 0xD6, 0x79, 0x02, 0x01, 0x11])
        guard var keyDescription = try getX509Extension(objectIdentifier: objectIdentifier) else { return nil }

        /*
         KeyDescription ::= SEQUENCE {
             attestationVersion  300,
             attestationSecurityLevel  SecurityLevel,
             keyMintVersion  INTEGER,
             keyMintSecurityLevel  SecurityLevel,
             attestationChallenge  OCTET_STRING,
             uniqueId  OCTET_STRING,
             softwareEnforced  AuthorizationList,
             hardwareEnforced  AuthorizationList,
         }
         */
        var keyDescriptionData = try keyDescription.dequeueASN1Record(type: 0x30)
        _ = try keyDescriptionData.dequeueASN1Record(type: 0x02) // attestationVersion
        let attestationSecurityLevelData = try keyDescriptionData.dequeueASN1Record(type: 0x0A)
        _ = try keyDescriptionData.dequeueASN1Record(type: 0x02) // keyMintVersion
        let keyMintSecurityLevelData = try keyDescriptionData.dequeueASN1Record(type: 0x0A)
        let attestationChallenge = try keyDescriptionData.dequeueASN1Record(type: 0x04)
        _ = try keyDescriptionData.dequeueASN1Record(type: 0x04) // uniqueId
        _ = try keyDescriptionData.dequeueASN1Record(type: 0x30) // softwareEnforced
        let hardwareAuthorizationList = try keyDescriptionData.dequeueASN1Record(type: 0x30)

        /*
         AuthorizationList ::= SEQUENCE {
             ...
             rootOfTrust  [704] EXPLICIT RootOfTrust OPTIONAL,
             ...
         }
         RootOfTrust ::= SEQUENCE {
             verifiedBootKey  OCTET_STRING,
             deviceLocked  BOOLEAN,
             verifiedBootState  VerifiedBootState,
             verifiedBootHash OCTET_STRING,
         }
         */
        guard var rootOfTrustData = hardwareAuthorizationList.getAuthorizationListItem(tag: 0xBF8540) else { return nil }
        var rootOfTrust = try rootOfTrustData.dequeueASN1Record(type: 0x30)
        _ = try rootOfTrust.dequeueASN1Record(type: 0x04) // verifiedBootKey
        let deviceLockedData = try rootOfTrust.dequeueASN1Record(type: 0x01)
        let verifiedBootState = try rootOfTrust.dequeueASN1Record(type: 0x0A)

        guard attestationSecurityLevelData.count == 1, let attestationSecurityLevel = KeyDescription.SecurityLevel(rawValue: attestationSecurityLevelData.first!) else {
            return nil
        }
        guard keyMintSecurityLevelData.count == 1, let keyMintSecurityLevel = KeyDescription.SecurityLevel(rawValue: keyMintSecurityLevelData.first!) else {
            return nil
        }
        guard deviceLockedData.count == 1 else { return nil }
        let deviceLocked = deviceLockedData.first! != 0
        guard verifiedBootState.count == 1, let bootState = KeyDescription.VerifiedBootState(rawValue: verifiedBootState.first!) else { return nil }

        return KeyDescription(
            attestationSecurityLevel: attestationSecurityLevel,
            keyMintSecurityLevel: keyMintSecurityLevel,
            attestationChallenge: attestationChallenge,
            deviceLocked: deviceLocked,
            bootState: bootState
        )
    }

    /**
     Interprets this data as a DER-encoded X509 certificate, and extracts the extension with the given object identifier

     Unfortunately, `SecCertificateCopyValues` is only available on Mac so we need to parse the certificate extensions ourselves. Rather than pull in a parsing library like swift-asn1 just to extract a single extension value, we hand-roll something that only parses the specific fields we need and skips the others.
     */
    func getX509Extension(objectIdentifier: Data) throws -> Data? {
        var mutableCopy = self
        /*
         Certificate  ::=  SEQUENCE  {
              tbsCertificate       TBSCertificate,
              signatureAlgorithm   AlgorithmIdentifier,
              signatureValue       BIT STRING
         }
         */
        var certificate = try mutableCopy.dequeueASN1Record(type: 0x30)
        var tbsCertificate = try certificate.dequeueASN1Record(type: 0x30)

        /*
         TBSCertificate  ::=  SEQUENCE  {
              version         [0]  EXPLICIT Version DEFAULT v1,
              serialNumber         CertificateSerialNumber,
              signature            AlgorithmIdentifier,
              issuer               Name,
              validity             Validity,
              subject              Name,
              subjectPublicKeyInfo SubjectPublicKeyInfo,
              issuerUniqueID  [1]  IMPLICIT UniqueIdentifier OPTIONAL,
                                   -- If present, version MUST be v2 or v3
              subjectUniqueID [2]  IMPLICIT UniqueIdentifier OPTIONAL,
                                   -- If present, version MUST be v2 or v3
              extensions      [3]  EXPLICIT Extensions OPTIONAL
                                    -- If present, version MUST be v3
         }
         */
        _ = try tbsCertificate.dequeueOptionalASN1Record(type: 0xA0) // version
        _ = try tbsCertificate.dequeueASN1Record(type: 0x02) // serial number
        _ = try tbsCertificate.dequeueASN1Record(type: 0x30) // signature
        _ = try tbsCertificate.dequeueASN1Record(type: 0x30) // issuer
        _ = try tbsCertificate.dequeueASN1Record(type: 0x30) // validity
        _ = try tbsCertificate.dequeueASN1Record(type: 0x30) // subject
        _ = try tbsCertificate.dequeueASN1Record(type: 0x30) // subjectPublicKeyInfo
        _ = try tbsCertificate.dequeueOptionalASN1Record(type: 0x81) // issuerUniqueID
        _ = try tbsCertificate.dequeueOptionalASN1Record(type: 0x82) // subjectUniqueID
        guard var extensionsData = try tbsCertificate.dequeueOptionalASN1Record(type: 0xA3) else { return nil }

        /*
         Extensions  ::=  SEQUENCE SIZE (1..MAX) OF Extension
         */
        var extensions = try extensionsData.dequeueASN1Record(type: 0x30)
        while !extensions.isEmpty {
            var extensionData = try extensions.dequeueASN1Record(type: 0x30)
            /*
             Extension  ::=  SEQUENCE  {
                  extnID      OBJECT IDENTIFIER,
                  critical    BOOLEAN DEFAULT FALSE,
                  extnValue   OCTET STRING
                              -- contains the DER encoding of an ASN.1 value
                              -- corresponding to the extension type identified
                              -- by extnID
             }
             */
            let extnID = try extensionData.dequeueASN1Record(type: 0x06)
            if extnID == objectIdentifier {
                _ = try extensionData.dequeueOptionalASN1Record(type: 0x01) // critical
                return try extensionData.dequeueASN1Record(type: 0x04)
            }
        }
        return nil
    }

    /**
     Interprets this data as a ASN.1 encoded AuthorizationList and extracts the KeyMint authorization item with the given tag
     */
    func getAuthorizationListItem(tag: Int) -> Data? {
        var mutableCopy = self
        while !mutableCopy.isEmpty {
            if let record = try? mutableCopy.dequeueASN1Record(), tag == record.tag {
                return record.payload
            }
        }
        return nil
    }

    /// Dequeues an encoded ASN.1 tag value
    private mutating func dequeueASN1Tag() throws -> Int {
        var ret = try Int(dequeueFirst())
        if ret & 0x1F == 0x1F {
            repeat {
                ret = try (ret << 8) | Int(dequeueFirst())
            } while ret & 0x80 != 0
        }
        return ret
    }

    /// Dequeues an ASN.1 length value.
    private mutating func dequeueASN1Length() throws -> Int {
        let lengthByte = try dequeueFirst()
        if lengthByte & 0x80 == 0 {
            return Int(lengthByte)
        } else {
            let lengthDataCount = Int(lengthByte & 0x7F)
            guard lengthDataCount <= 8 else { throw CancellationError() }
            let lengthData = try dequeueData(count: lengthDataCount)
            var ret = 0
            for byte in lengthData {
                ret = ret << 8 | Int(byte)
            }
            return ret
        }
    }

    /// Dequeues a full ASN.1 record
    private mutating func dequeueASN1Record() throws -> (tag: Int, payload: Data) {
        let tag = try dequeueASN1Tag()
        let length = try dequeueASN1Length()
        let payload = try dequeueData(count: length)
        return (tag, payload)
    }

    /// Dequeues an ASN.1 record, checking it against the expected type
    private mutating func dequeueASN1Record(type: UInt8) throws -> Data {
        guard type == first else { throw CancellationError() }
        removeFirst()
        return try dequeueData(count: dequeueASN1Length())
    }

    /// Dequeues an ASN.1 record if the type matches
    private mutating func dequeueOptionalASN1Record(type: UInt8) throws -> Data? {
        guard type == first else { return nil }
        removeFirst()
        return try dequeueData(count: dequeueASN1Length())
    }
}

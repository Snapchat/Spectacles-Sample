// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation
import Security

/**
 Actor used to guard access to the Security and CryptoKit frameworks.

 Neither of these frameworks has comprehensive sendability annotations, so we isolated all crypto operations to a global actor just to be safe.
 */
@globalActor
actor SecurityActor {
    static let shared = SecurityActor()
}

/// Error indicating that the a function from the iOS security framework has failed
struct SecError: Error {
    let functionName: String
    /// The return value of the function
    let returnValue: Int32
}

/// Generates cryptographically secure random bytes using `SecRandomCopyBytes`
func secureRandom(count: Int) throws -> Data {
    var ret = Data(count: count)
    let result = ret.withUnsafeMutableBytes { bytes in
        SecRandomCopyBytes(nil, count, bytes.baseAddress!)
    }
    if result == 0 {
        return ret
    } else {
        throw SecError(functionName: "SecRandomCopyBytes", returnValue: result)
    }
}

/// Provides wrappers around keychain access
@SecurityActor
enum Keychain {
    /// Service ID used for all keychain items.
    private static let keychainServiceId = "com.snap.spectacles-mobile-kit"

    /// Adds or updates a generic password item with the given account name
    static func addItem(account: String, data: Data) throws {
        let query = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: keychainServiceId,
            kSecAttrAccount: account,
            kSecValueData: data,
        ] as CFDictionary

        let status = SecItemAdd(query as CFDictionary, nil)
        if status == errSecDuplicateItem {
            let status = SecItemUpdate(query as CFDictionary, [kSecValueData: data] as CFDictionary)
            if status != errSecSuccess {
                throw SecError(functionName: "SecItemUpdate", returnValue: status)
            }
        } else if status != errSecSuccess {
            throw SecError(functionName: "SecItemAdd", returnValue: status)
        }
    }

    /// Retrieves a generic password item with the given account name
    static func copyItem(account: String) throws -> Data? {
        let query = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: keychainServiceId,
            kSecAttrAccount: account,
            kSecMatchLimit: kSecMatchLimitOne,
            kSecReturnData: true,
        ] as CFDictionary
        var result: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        if status == errSecItemNotFound {
            return nil
        } else if status != errSecSuccess {
            throw SecError(functionName: "SecItemCopyMatching", returnValue: status)
        }

        return result as? Data
    }

    /// Deletes a generic password item with the given account name
    static func deleteItem(account: String) throws {
        let query = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: keychainServiceId,
            kSecAttrAccount: account,
        ] as CFDictionary
        let status = SecItemDelete(query)
        if status != errSecSuccess, status != errSecItemNotFound {
            throw SecError(functionName: "SecItemDelete", returnValue: status)
        }
    }

    /// Deletes all generic password item with our service id
    static func clear() throws {
        let query = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: keychainServiceId,
        ] as CFDictionary
        let status = SecItemDelete(query)
        if status != errSecSuccess, status != errSecItemNotFound {
            throw SecError(functionName: "SecItemDelete", returnValue: status)
        }
    }
}

@SecurityActor
extension SecCertificate {
    /// Creates a certificate from x509 der data. See `SecCertificateCreateWithData`
    static func create(data: Data) throws -> SecCertificate {
        guard let cert = SecCertificateCreateWithData(kCFAllocatorDefault, data as CFData) else {
            throw SecError(functionName: "SecCertificateCreateWithData", returnValue: errSecInvalidValue)
        }
        return cert
    }
}

@SecurityActor
extension SecKey {
    /// Copies a key's external representation. See `SecKeyCopyExternalRepresentation`
    func copyExternalRepresentation() throws -> Data {
        var error: Unmanaged<CFError>?
        let keyData = SecKeyCopyExternalRepresentation(self, &error)
        let retainedError = error?.takeRetainedValue()
        if let keyData {
            return keyData as Data
        } else {
            throw retainedError ?? SecError(
                functionName: "SecKeyCopyExternalRepresentation",
                returnValue: errSecInvalidValue
            )
        }
    }

    /// Verifies a signature using this key. See `SecKeyVerifySignature`
    func verifySignature(algorithm: SecKeyAlgorithm, signedData: Data, signature: Data) throws {
        var error: Unmanaged<CFError>?
        let result = SecKeyVerifySignature(self, algorithm, signedData as CFData, signature as CFData, &error)
        let retainedError = error?.takeRetainedValue()
        if !result {
            throw retainedError ?? SecError(
                functionName: "SecKeyVerifySignature",
                returnValue: errSecInvalidValue
            )
        }
    }
}

@SecurityActor
extension SecTrust {
    /// Creates a trust object from a certificate chain. See `SecTrustCreateWithCertificates`
    static func create(certificates: [SecCertificate]) throws -> SecTrust {
        var trust: SecTrust? = nil
        let status = SecTrustCreateWithCertificates(certificates as AnyObject, SecPolicyCreateBasicX509(), &trust)
        guard let trust, status == errSecSuccess else {
            throw SecError(functionName: "SecTrustCreateWithCertificates", returnValue: errSecInvalidValue)
        }
        return trust
    }

    /// Sets the anchor certificates used to evaluate this object. See `SecTrustSetAnchorCertificates`
    func setAnchorCertificates(_ certificates: [SecCertificate]) throws {
        let status = SecTrustSetAnchorCertificates(self, certificates as CFArray)
        if status != errSecSuccess {
            throw SecError(functionName: "SecTrustSetAnchorCertificates", returnValue: status)
        }
    }

    /// Evaluates this trust object. See `SecTrustEvaluateWithError`
    func evaluate() throws {
        var error: CFError?
        if !SecTrustEvaluateWithError(self, &error) {
            throw error ?? SecError(functionName: "SecTrustEvaluateWithError", returnValue: errSecInvalidValue)
        }
    }

    /// Copies the public key of this trust object's leaf certificate. See `SecTrustCopyKey`
    func copyKey() throws -> SecKey {
        guard let key = SecTrustCopyKey(self) else {
            throw SecError(functionName: "SecTrustCopyKey", returnValue: errSecInvalidValue)
        }
        return key
    }
}

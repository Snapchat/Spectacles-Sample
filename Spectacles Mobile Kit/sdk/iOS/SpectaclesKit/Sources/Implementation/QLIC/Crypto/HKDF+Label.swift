// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation

extension HKDF {
    /// Label prefix used by the HKDF-Expand-Label function
    private static var labelPrefix: String { "qlic " }

    /**
     Implements a modified form of the HKDF-Expand-Label function from the TLS 1.3 spec
     - parameters:
        - pseudoRandomKey: Cryptographically strong key material
        - label: Shared string label used for key derivation
        - transcriptHash: Optional hash, typically of the current handshake bytes
        - outputByteCount: Desired length of the output key
     */
    static func expand(
        pseudoRandomKey: some ContiguousBytes,
        label: String,
        transcriptHash: some ContiguousBytes,
        outputByteCount: Int
    ) -> SymmetricKey {
        /*
         struct {
           uint16 length = outputByteCount;
           opaque label<6..255> = "qlic " + label;
           opaque context<0..255> = transcriptHash;
         } HkdfLabel;
         */
        transcriptHash.withUnsafeBytes { transcriptBytes in
            let totalSize = 9 + label.utf8.count + transcriptBytes.count
            return withUnsafeTemporaryAllocation(byteCount: totalSize, alignment: 2) { buffer in
                // output byte count
                buffer.storeBytes(of: UInt16(outputByteCount).bigEndian, as: UInt16.self)
                // total label length = prefix length + label length
                buffer[2] = UInt8(5 + label.utf8.count)
                // label
                buffer[3...].copyBytes(from: labelPrefix.utf8)
                buffer[8...].copyBytes(from: label.utf8)
                // transcript hash length
                let offset = 8 + label.utf8.count
                buffer[offset] = UInt8(transcriptBytes.count)
                // trnascript hash
                buffer[(offset + 1)...].copyBytes(from: transcriptBytes)
                return expand(
                    pseudoRandomKey: pseudoRandomKey,
                    info: UnsafeRawBufferPointer(buffer),
                    outputByteCount: outputByteCount
                )
            }
        }
    }
}

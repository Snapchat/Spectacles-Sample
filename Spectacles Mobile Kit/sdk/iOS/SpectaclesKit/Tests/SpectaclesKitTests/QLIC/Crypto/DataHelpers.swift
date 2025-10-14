// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
import Foundation

func hexString(_ sequence: some Sequence<UInt8>) -> String {
    sequence.map { String(format: "%02x", $0) }.joined()
}
func hexString(_ key: SymmetricKey) -> String {
    key.withUnsafeBytes { $0.map { String(format: "%02x", $0) }.joined() }
}
func data(hexString: String) -> Data {
    var ret = Data()
    for i in 0 ..< (hexString.count) / 2 {
        let start = hexString.index(hexString.startIndex, offsetBy: 2 * i)
        let end = hexString.index(start, offsetBy: 2)
        ret.append(UInt8(String(hexString[start ..< end]), radix: 16)!)
    }
    return ret
}

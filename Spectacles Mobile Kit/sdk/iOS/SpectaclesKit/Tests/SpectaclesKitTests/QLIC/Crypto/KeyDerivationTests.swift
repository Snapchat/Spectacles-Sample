// Copyright © 2024 Snap, Inc. All rights reserved.

import CryptoKit
@testable import SpectaclesKit
import XCTest

/**
 Sample key derivation using same handshake bytes as `ClientHandshakeTests.runUnauthenticatedServerHandshake`

 Uses a slightly modified version of https://tls13.xargs.org/files/hkdf-384.sh for hkdf calculations
 */
enum UnauthenticatedHandshakeSecrets {
    /*
     First, derive handshake keys from shared secret
     $ hello_hash=12f488fbcd1e1d5f82a4288c381f6a242cab3e86a8592a137908a450c57883127841c83922a8e108866ed3651a8db47e
     $ shared_secret=31dd51a54946a650c167c9eeac4a7e9781308281d294cd91a86ec86608c643736132fd6b55f9387054fccb9363d8e31c
     $ psk=$(./hkdf extract 00 $shared_secret)
     $ root_secret=$(./hkdf expandlabel $psk "derived" $hello_hash 48)
     $ handshake_secret=$(./hkdf expandlabel $root_secret "Handshakederived" $hello_hash 48)
     $ csecret=$(./hkdf expandlabel $handshake_secret "c hs traffic" "" 48)
     $ ssecret=$(./hkdf expandlabel $handshake_secret "s hs traffic" "" 48)
     $ ckey=$(./hkdf expandlabel $csecret "key" "" 16)
     $ skey=$(./hkdf expandlabel $ssecret "key" "" 16)
     $ civ=$(./hkdf expandlabel $csecret "iv" "" 12)
     $ siv=$(./hkdf expandlabel $ssecret "iv" "" 12)
     $ echo -e "$root_secret\nssecret: $ssecret\nskey: $skey\nsiv: $siv\ncsecret: $csecret\nckey: $ckey\nciv: $civ"
     d8ba991272eeecf9dc71465e1d5cff23ed8acb553bb7f4b83b4601202807b5e638be0f3a66db361ec47ce9e0e23c60a6
     ssecret: 5619208e3ec677881938c7d66469ac92d435d8899c07d36c3c29b8e187f5d2eff8f4524162a53577625905223402c344
     skey: 50826c77d7a056cdfe09b124720da3c3
     siv: af4ece90dbe9f7d7948b2f5f
     csecret: 68450c9039703ec3a4abae801e6599b664f2a7e87d49d18551c696de2cca45ab0a4e7168ac326f528eae92acf0a4ecad
     ckey: e78bab3801fa3c170813057d00e88087
     civ: 7810616b85b91c61507a2244
     */
    static let helloHash = "12f488fbcd1e1d5f82a4288c381f6a242cab3e86a8592a137908a450c57883127841c83922a8e108866ed3651a8db47e"
    static let sharedSecret = "31dd51a54946a650c167c9eeac4a7e9781308281d294cd91a86ec86608c643736132fd6b55f9387054fccb9363d8e31c"
    static let rootSecret = "d8ba991272eeecf9dc71465e1d5cff23ed8acb553bb7f4b83b4601202807b5e638be0f3a66db361ec47ce9e0e23c60a6"
    static let serverHandshakeSecret = "5619208e3ec677881938c7d66469ac92d435d8899c07d36c3c29b8e187f5d2eff8f4524162a53577625905223402c344"
    static let serverHandshakeKey = "50826c77d7a056cdfe09b124720da3c3"
    static let serverHandshakeIV = "af4ece90dbe9f7d7948b2f5f"
    static let clientHandshakeSecret = "68450c9039703ec3a4abae801e6599b664f2a7e87d49d18551c696de2cca45ab0a4e7168ac326f528eae92acf0a4ecad"
    static let clientHandshakeKey = "e78bab3801fa3c170813057d00e88087"
    static let clientHandshakeIV = "7810616b85b91c61507a2244"

    /*
     Then, derive app keys from root secret

     $ handshake_hash=99f5a281c32022793794898643c662fa443c991324d1f33185d18c98d4855bd809557c9858b9b69fdc94c4b55fcebd6d
     $ root_secret=d8ba991272eeecf9dc71465e1d5cff23ed8acb553bb7f4b83b4601202807b5e638be0f3a66db361ec47ce9e0e23c60a6
     $ master_secret=$(./hkdf expandlabel $root_secret "Sessionderived" $handshake_hash 48)
     $ csecret=$(./hkdf expandlabel $master_secret "c ap traffic" "" 48)
     $ ssecret=$(./hkdf expandlabel $master_secret "s ap traffic" "" 48)
     $ ckey=$(./hkdf expandlabel $csecret "key" "" 16)
     $ skey=$(./hkdf expandlabel $ssecret "key" "" 16)
     $ civ=$(./hkdf expandlabel $csecret "iv" "" 12)
     $ siv=$(./hkdf expandlabel $ssecret "iv" "" 12)
     $ echo -e "ssecret: $ssecret\nskey: $skey\nsiv: $siv\ncsecret: $csecret\nckey: $ckey\nciv: $civ"
     ssecret: 4af354590c30b018da4817af84325f56dbf8da50bc2522f6e42ae895f0e9ce3edf31754b468c6d72e7ccbc8ec4d50bff
     skey: d2d55d7f786079c157d261ae2f4ec336
     siv: 4eae27ac677b4924077b4344
     csecret: a8b70262c5ceca77b99043292673a05ee35fcaba598d1b165deeb51210c5cf27e816a3c1900b69527610d4fd74ecfc59
     ckey: 194e12da9483c0855d8a076bca0ced82
     civ: e24945ea8975921e09fff3ce
     */
    static let handshakeHash = "99f5a281c32022793794898643c662fa443c991324d1f33185d18c98d4855bd809557c9858b9b69fdc94c4b55fcebd6d"
    static let serverAppSecret = "4af354590c30b018da4817af84325f56dbf8da50bc2522f6e42ae895f0e9ce3edf31754b468c6d72e7ccbc8ec4d50bff"
    static let serverAppKey = "d2d55d7f786079c157d261ae2f4ec336"
    static let serverAppIV = "4eae27ac677b4924077b4344"
    static let clientAppSecret = "a8b70262c5ceca77b99043292673a05ee35fcaba598d1b165deeb51210c5cf27e816a3c1900b69527610d4fd74ecfc59"
    static let clientAppKey = "194e12da9483c0855d8a076bca0ced82"
    static let clientAppIV = "e24945ea8975921e09fff3ce"

    /*
     Lastly, test that the key update mechanism works properly.

     $ old_csecret=a8b70262c5ceca77b99043292673a05ee35fcaba598d1b165deeb51210c5cf27e816a3c1900b69527610d4fd74ecfc59
     $ old_ssecret=4af354590c30b018da4817af84325f56dbf8da50bc2522f6e42ae895f0e9ce3edf31754b468c6d72e7ccbc8ec4d50bff
     $ csecret=$(./hkdf expandlabel $old_csecret "traffic upd" "" 48)
     $ ssecret=$(./hkdf expandlabel $old_ssecret "traffic upd" "" 48)
     $ ckey=$(./hkdf expandlabel $csecret "key" "" 16)
     $ skey=$(./hkdf expandlabel $ssecret "key" "" 16)
     $ civ=$(./hkdf expandlabel $csecret "iv" "" 12)
     $ siv=$(./hkdf expandlabel $ssecret "iv" "" 12)
     $ echo -e "ssecret: $ssecret\nskey: $skey\nsiv: $siv\ncsecret: $csecret\nckey: $ckey\nciv: $civ"
     ssecret: 40bdeb2fbe8854af9fcb4a57b2cdfc4062fa03a4e1f5e51e03ec465d44f60c3fac77847ad8725eb41f65a5669018229d
     skey: b1d7f0431f8da85a702386ce839c5032
     siv: b90f20e7e3f586902d1437cf
     csecret: 6afe4381f843444f746d379900bbc9fd2f51fb774b478ca0f44a867986e761119bde6a5184cae80ae00c8fe8f3120e64
     ckey: 630f57278d170aebbd7f1ab6e755920c
     civ: a0237d23872fd4949e2fe2c4
     */
    static let serverUpdateSecret = "40bdeb2fbe8854af9fcb4a57b2cdfc4062fa03a4e1f5e51e03ec465d44f60c3fac77847ad8725eb41f65a5669018229d"
    static let serverUpdateKey = "b1d7f0431f8da85a702386ce839c5032"
    static let serverUpdateIV = "b90f20e7e3f586902d1437cf"
    static let clientUpdateSecret = "6afe4381f843444f746d379900bbc9fd2f51fb774b478ca0f44a867986e761119bde6a5184cae80ae00c8fe8f3120e64"
    static let clientUpdateKey = "630f57278d170aebbd7f1ab6e755920c"
    static let clientUpdateIV = "a0237d23872fd4949e2fe2c4"
}

final class KeyDerivationTests: XCTestCase {
    func testKeyDerivation() {
        let sharedSecret = data(hexString: UnauthenticatedHandshakeSecrets.sharedSecret)
        let helloHash = data(hexString: UnauthenticatedHandshakeSecrets.helloHash)
        let rootSecret = RootSecret<HandshakeEngine.Hasher>(
            inputKeyMaterial: SymmetricKey(data: sharedSecret),
            transcriptHash: helloHash
        )

        let (clientHandshakeSecret, serverHandshakeSecret) = rootSecret.expandPeerSecrets(
            type: .handshake,
            transcriptHash: helloHash
        )
        let clientHandshakeKey = clientHandshakeSecret.expandKeys(keyLength: 16, ivLength: 12, securityLevel: .handshake)
        let serverHandshakeKey = serverHandshakeSecret.expandKeys(keyLength: 16, ivLength: 12, securityLevel: .handshake)
        XCTAssertEqual(hexString(rootSecret.secret), UnauthenticatedHandshakeSecrets.rootSecret)
        XCTAssertEqual(hexString(serverHandshakeSecret.secret), UnauthenticatedHandshakeSecrets.serverHandshakeSecret)
        XCTAssertEqual(hexString(serverHandshakeKey.key), UnauthenticatedHandshakeSecrets.serverHandshakeKey)
        XCTAssertEqual(hexString(serverHandshakeKey.iv), UnauthenticatedHandshakeSecrets.serverHandshakeIV)
        XCTAssertEqual(hexString(clientHandshakeSecret.secret), UnauthenticatedHandshakeSecrets.clientHandshakeSecret)
        XCTAssertEqual(hexString(clientHandshakeKey.key), UnauthenticatedHandshakeSecrets.clientHandshakeKey)
        XCTAssertEqual(hexString(clientHandshakeKey.iv), UnauthenticatedHandshakeSecrets.clientHandshakeIV)

        let handshakeHash = data(hexString: UnauthenticatedHandshakeSecrets.handshakeHash)
        var (clientAppSecret, serverAppSecret) = rootSecret.expandPeerSecrets(type: .app, transcriptHash: handshakeHash)
        let clientAppKey = clientAppSecret.expandKeys(keyLength: 16, ivLength: 12, securityLevel: .app)
        let serverAppKey = serverAppSecret.expandKeys(keyLength: 16, ivLength: 12, securityLevel: .app)
        XCTAssertEqual(hexString(serverAppSecret.secret), UnauthenticatedHandshakeSecrets.serverAppSecret)
        XCTAssertEqual(hexString(serverAppKey.key), UnauthenticatedHandshakeSecrets.serverAppKey)
        XCTAssertEqual(hexString(serverAppKey.iv), UnauthenticatedHandshakeSecrets.serverAppIV)
        XCTAssertEqual(hexString(clientAppSecret.secret), UnauthenticatedHandshakeSecrets.clientAppSecret)
        XCTAssertEqual(hexString(clientAppKey.key), UnauthenticatedHandshakeSecrets.clientAppKey)
        XCTAssertEqual(hexString(clientAppKey.iv), UnauthenticatedHandshakeSecrets.clientAppIV)

        clientAppSecret.update()
        serverAppSecret.update()
        let updatedClientAppKey = clientAppSecret.expandKeys(keyLength: 16, ivLength: 12, securityLevel: .app)
        let updatedServerAppKey = serverAppSecret.expandKeys(keyLength: 16, ivLength: 12, securityLevel: .app)
        XCTAssertEqual(hexString(serverAppSecret.secret), UnauthenticatedHandshakeSecrets.serverUpdateSecret)
        XCTAssertEqual(hexString(updatedServerAppKey.key), UnauthenticatedHandshakeSecrets.serverUpdateKey)
        XCTAssertEqual(hexString(updatedServerAppKey.iv), UnauthenticatedHandshakeSecrets.serverUpdateIV)
        XCTAssertEqual(hexString(clientAppSecret.secret), UnauthenticatedHandshakeSecrets.clientUpdateSecret)
        XCTAssertEqual(hexString(updatedClientAppKey.key), UnauthenticatedHandshakeSecrets.clientUpdateKey)
        XCTAssertEqual(hexString(updatedClientAppKey.iv), UnauthenticatedHandshakeSecrets.clientUpdateIV)
    }
}

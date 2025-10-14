// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

extension AuthenticationAlgorithm: VisitorEncodable {
    /// Encodes `self` into some generic encoding visitor
    func encode(into visitor: inout some EncodingVisitor) throws {
        switch self {
        case let .pretrusted(publicKey: publicKey):
            try visitor.visit(0x1)
            try visitor.visit(publicKey.count)
            visitor.visit(publicKey)
        case .iosDeviceCheck:
            try visitor.visit(0x2)
            try visitor.visit(0)
        case .x509Cert:
            try visitor.visit(0x4)
            try visitor.visit(0)
#if DEBUG
        case .unauthenticated:
            try visitor.visit(0x6E_6F20_6175_7468)
            try visitor.visit(0)
#endif
        }
    }

    // Parses the authentication algorithm from some data and removes those bytes
    static func dequeueAlgorithm(from data: inout Data) throws -> AuthenticationAlgorithm? {
        let type = try data.dequeueVarInt()
        let length = try data.dequeueVarInt()
        let payload = try data.dequeueData(count: length)
        switch type {
        case 0x1:
            return .pretrusted(publicKey: payload)
        case 0x2:
            return .iosDeviceCheck
        case 0x4:
            return .x509Cert
#if DEBUG
        case 0x6E_6F20_6175_7468:
            return .unauthenticated
#endif
        default:
            return nil
        }
    }
}

extension AuthenticationShareData: VisitorEncodable {
    /// Encodes `self` into some generic encoding visitor
    func encode(into visitor: inout some EncodingVisitor) throws {
        switch self {
        case .pretrusted:
            try visitor.visit(0x1)
        case let .iosDeviceCheck(publicKey: publicKey, attestationObject: attestationObject):
            try visitor.visit(0x2)
            try visitor.visit(publicKey.count)
            visitor.visit(publicKey)
            try visitor.visit(attestationObject.count)
            visitor.visit(attestationObject)
        case let .x509Cert(certChain: certChain):
            try visitor.visit(0x4)
            try visitor.visit(certChain.count)
            for cert in certChain {
                try visitor.visit(cert.count)
                visitor.visit(cert)
            }
#if DEBUG
        case let .unauthenticated(identity: identity):
            try visitor.visit(0x6E_6F20_6175_7468) // 'no auth'
            try visitor.visit(identity.count)
            visitor.visit(Data(identity.utf8))
#endif
        }
    }

    // Parses the share data from some data and removes those bytes
    static func dequeueShareData(from data: inout Data) throws -> AuthenticationShareData {
        let type = try data.dequeueVarInt()
        switch type {
        case 0x1:
            return .pretrusted
        case 0x2:
            let publicKeyCount = try data.dequeueVarInt()
            let publicKey = try data.dequeueData(count: publicKeyCount)
            let attestationObjectCount = try data.dequeueVarInt()
            let attestationObject = try data.dequeueData(count: attestationObjectCount)
            return .iosDeviceCheck(publicKey: publicKey, attestationObject: attestationObject)
        case 0x4:
            let certChainCount = try data.dequeueVarInt()
            var certChain = [Data]()
            certChain.reserveCapacity(certChainCount)
            for _ in 0 ..< certChainCount {
                let count = try data.dequeueVarInt()
                try certChain.append(data.dequeueData(count: count))
            }
            return .x509Cert(certChain: certChain)
#if DEBUG
        case 0x6E_6F20_6175_7468: // 'no auth'
            let identityCount = try data.dequeueVarInt()
            let identityData = try data.dequeueData(count: identityCount)
            guard let identity = String(data: identityData, encoding: .utf8) else {
                throw CancellationError()
            }
            return .unauthenticated(identity: identity)
#endif
        default:
            throw UnrecognizedTypeError(type: type)
        }
    }
}

extension HandshakeRecord: VisitorEncodable {
    /// Encodes `self` into some generic encoding visitor
    func encode(into visitor: inout some EncodingVisitor) throws {
        switch self {
        case let .clientHello(
            clientRandom: clientRandom,
            keyShare: keyShare,
            clientAuthenticationAlgorithms: clientAuthenticationAlgorithms,
            serverAuthenticationAlgorithms: serverAuthenticationAlgorithms
        ):
            try visitor.visit(0x1)
            try visitor.visit(clientRandom.count)
            visitor.visit(clientRandom)
            try visitor.visit(keyShare.count)
            visitor.visit(keyShare)
            try visitor.visit(clientAuthenticationAlgorithms.count)
            for algorithm in clientAuthenticationAlgorithms {
                try algorithm.encode(into: &visitor)
            }
            try visitor.visit(serverAuthenticationAlgorithms.count)
            for algorithm in serverAuthenticationAlgorithms {
                try algorithm.encode(into: &visitor)
            }
        case let .serverHello(serverRandom: serverRandom, keyShare: keyShare):
            try visitor.visit(0x2)
            try visitor.visit(serverRandom.count)
            visitor.visit(serverRandom)
            try visitor.visit(keyShare.count)
            visitor.visit(keyShare)
        case let .authenticationRequest(
            clientAlgorithmIndex: clientAlgorithmIndex,
            serverAlgorithmIndex: serverAlgorithmIndex
        ):
            try visitor.visit(0xD)
            try visitor.visit(clientAlgorithmIndex)
            try visitor.visit(serverAlgorithmIndex)
        case let .authenticationShare(shareData: shareData):
            try visitor.visit(0xB)
            try shareData.encode(into: &visitor)
        case let .authenticationVerify(signature: signature):
            try visitor.visit(0xF)
            try visitor.visit(signature.count)
            visitor.visit(signature)
        case let .keyUpdate(updateRequested: updateRequested):
            try visitor.visit(0x18)
            try visitor.visit(updateRequested ? 1 : 0)
        }
    }

    /// Parses a record from some data and removes those bytes
    static func dequeueRecord(from data: inout Data) throws -> HandshakeRecord {
        let type = try data.dequeueVarInt()
        switch type {
        case 0x1:
            let clientRandomSize = try data.dequeueVarInt()
            let clientRandom = try data.dequeueData(count: clientRandomSize)
            let keyShareSize = try data.dequeueVarInt()
            let keyShare = try data.dequeueData(count: keyShareSize)
            let clientAlgorithmCount = try data.dequeueVarInt()
            let clientAuthenticationAlgorithms = try (0 ..< clientAlgorithmCount).compactMap { _ in
                try AuthenticationAlgorithm.dequeueAlgorithm(from: &data)
            }
            let serverAlgorithmCount = try data.dequeueVarInt()
            let serverAuthenticationAlgorithms = try (0 ..< serverAlgorithmCount).compactMap { _ in
                try AuthenticationAlgorithm.dequeueAlgorithm(from: &data)
            }
            return .clientHello(
                clientRandom: clientRandom,
                keyShare: keyShare,
                clientAuthenticationAlgorithms: clientAuthenticationAlgorithms,
                serverAuthenticationAlgorithms: serverAuthenticationAlgorithms
            )
        case 0x2:
            let serverRandomSize = try data.dequeueVarInt()
            let serverRandom = try data.dequeueData(count: serverRandomSize)
            let keyShareSize = try data.dequeueVarInt()
            let keyShare = try data.dequeueData(count: keyShareSize)
            return .serverHello(serverRandom: serverRandom, keyShare: keyShare)
        case 0xD:
            let clientAlgorithmIndex = try data.dequeueVarInt()
            let serverAlgorithmIndex = try data.dequeueVarInt()
            return .authenticationRequest(
                clientAlgorithmIndex: clientAlgorithmIndex,
                serverAlgorithmIndex: serverAlgorithmIndex
            )
        case 0xB:
            let shareData = try AuthenticationShareData.dequeueShareData(from: &data)
            return .authenticationShare(shareData: shareData)
        case 0xF:
            let signatureSize = try data.dequeueVarInt()
            let signature = try data.dequeueData(count: signatureSize)
            return .authenticationVerify(signature: signature)
        case 0x18:
            let updateRequested = try data.dequeueVarInt() != 0
            return .keyUpdate(updateRequested: updateRequested)
        default:
            throw UnrecognizedTypeError(type: type)
        }
    }
}

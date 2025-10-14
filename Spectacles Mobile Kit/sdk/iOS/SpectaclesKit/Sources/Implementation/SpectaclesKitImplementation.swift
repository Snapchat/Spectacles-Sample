// Copyright © 2024 Snap, Inc. All rights reserved.

import Combine
import Foundation

final class BondingManagerImplementation: BondingManager {
    private let identifier: ClientIdentifier
    private let version: String
    private let auth: any Authentication
    private let bluetoothManager: BluetoothManager
    private let dependencies: Dependencies

    init(
        identifier: ClientIdentifier,
        version: String,
        auth: any Authentication,
        bluetoothAdapter: BluetoothAdapter,
        dependencies: Dependencies
    ) {
        self.identifier = identifier
        self.version = version
        self.auth = auth
        self.bluetoothManager = BluetoothManager(adapter: bluetoothAdapter)
        self.dependencies = dependencies
    }

    func bind(request: BondingRequest, deeplinkAsyncStream: AsyncStream<URL>) async -> BondingResult {
        Log.info("Received bind request \(request)")
        do {
            let result = try await dependencies.bondingResultFetcher.bind(
                request: request,
                deeplinkAsyncStream: deeplinkAsyncStream
            )
            Log.info("Bind request succeeded: \(result)")
            dependencies.bondingRepository.saveBonding(bonding: result)
            return .success(result)
        } catch {
            Log.info("Bind request failed: \(error)")
            return .failure(error)
        }
    }

    func unbind(id: String, deeplinkAsyncStream: AsyncStream<URL>) async -> BondingResult {
        Log.info("Received unbind request for id: \(id)")
        do {
            guard let bonding = dependencies.bondingRepository.getBonding(bondingId: id) else {
                return .failure(SpectaclesRequestError.unknown)
            }
            try await dependencies.bondingResultFetcher.unbind(
                bonding: bonding,
                deeplinkAsyncStream: deeplinkAsyncStream
            )
            Log.info("Unbind request for id \(id) succeeded")
            dependencies.bondingRepository.deleteBonding(bondingId: id)
            return .success(bonding)
        } catch {
            Log.info("Unbind request for id \(id) failed: \(error)")
            return .failure(error)
        }
    }

    func availableBondings() -> [any Bonding] {
        return dependencies.bondingRepository.getAllBondings()
    }

    func getBonding(id: String) -> (any Bonding)? {
        return dependencies.bondingRepository.getBonding(bondingId: id)
    }

    func createSession(
        bonding: any Bonding,
        request: SessionRequest,
        delegateBuilder: @escaping (any SpectaclesSession) -> any SpectaclesRequestDelegate
    ) throws -> any SpectaclesSession {
        let bonding = dependencies.bondingRepository.getBonding(bondingId: bonding.id)!
        let session = SMKPSession(bluetoothManager: bluetoothManager)
        let delegate = delegateBuilder(session)
        Task {
            await session.run(
                bonding: bonding,
                sessionRequest: request,
                bondingRespository: dependencies.bondingRepository,
                delegate: delegate
            )
        }
        return session
    }
}

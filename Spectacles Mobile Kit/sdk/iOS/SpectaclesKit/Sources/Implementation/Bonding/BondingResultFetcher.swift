// Copyright © 2024 Snap, Inc. All rights reserved.

import Combine
import UIKit

enum BondingResultFetcherError: Error {
    case spectaclesAppNotInstalled
    case openDeeplinkFailed
    case invalidDeeplinkFormat
    case timeout
    case missingLensId
    case unbindResultError
}

final class BondingResultFetcher: Sendable {
    enum ActionType: Sendable {
        case bind(lensId: String, lensName: String)
        case unbind(deviceId: String, bondingId: UUID)

        var valueString: String {
            switch self {
            case .bind:
                return "bind"
            case .unbind:
                return "unbind"
            }
        }
    }

    private let spectaclesAppScheme = "cmb"
    private let timeOutSeconds = 60
    private let clientId: ClientIdentifier
    @MainActor private var urlHandler: UIApplication {
        return UIApplication.shared
    }

    init(clientId: ClientIdentifier) {
        self.clientId = clientId
    }

    @MainActor
    private func createURL(action: ActionType) -> URL? {
        guard let appId = Bundle.main.bundleIdentifier else {
            return nil
        }
        var components = URLComponents()
        components.scheme = spectaclesAppScheme
        components.host = action.valueString
        // TODO: Allow the host app to configure this.
        // If two apps support the same URL scheme, iOS may randomly select one to open.
        // We should avoid hardcoding 'specskitapp' here.
        if case let .bind(lensId, lensName) = action {
            components.queryItems = [
                URLQueryItem(name: "redirectUrl", value: "specskitapp://specs-kit/\(action.valueString)"),
                URLQueryItem(name: "clientId", value: clientId.clientId),
                URLQueryItem(name: "type", value: "0"), // optional, default is 0, for single lens bonding
                URLQueryItem(name: "lensId", value: lensId),
                URLQueryItem(name: "lensName", value: lensName),
                URLQueryItem(name: "appId", value: appId),
                URLQueryItem(name: "appName", value: clientId.appName),
            ]
        } else if case let .unbind(deviceId, bondingId) = action {
            components.queryItems = [
                URLQueryItem(name: "redirectUrl", value: "specskitapp://specs-kit/\(action.valueString)"),
                URLQueryItem(name: "bondingId", value: bondingId.uuidString),
                URLQueryItem(name: "deviceId", value: deviceId),
                URLQueryItem(name: "appId", value: appId),
            ]
        }

        guard let url = components.url else {
            return nil
        }
        if urlHandler.canOpenURL(url) {
            return url
        } else {
            return nil
        }
    }

    private func resolveBindURL(_ url: URL, lensId: String) throws -> SpectaclesBonding {
        // specskitapp://specs-kit/bind?
        // - status ($status)
        // - bondingId ($bonding-id)
        // - deviceId (mutliple Spectacles scenarios, base64(sha128(bonding-id + serial number)))
        // - address (the BLE address of the Spectacles)
        guard
            let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
            let queryItems = components.queryItems
        else {
            throw BondingResultFetcherError.invalidDeeplinkFormat
        }

        // Extract values from the query parameters
        func getQueryValue(for name: String) -> String? {
            return queryItems.first(where: { $0.name == name })?.value
        }

        guard
            let deviceAddress = getQueryValue(for: BondingIdentifier.Keys.deviceAddress.rawValue),
            let assignedId = getQueryValue(for: BondingIdentifier.Keys.assignedId.rawValue),
            let deviceId = getQueryValue(for: "deviceId")
        else {
            throw BondingResultFetcherError.invalidDeeplinkFormat
        }

        guard let deviceAddress = UUID(uuidString: deviceAddress), let assignedId = UUID(uuidString: assignedId) else {
            throw BondingResultFetcherError.invalidDeeplinkFormat
        }

        let identifier = BondingIdentifier(assignedId: assignedId, deviceAddress: deviceAddress)
        guard let id = try? BondingIdentifierSerializer().serialize(source: identifier) else {
            throw BondingResultFetcherError.invalidDeeplinkFormat
        }

        let bonding = SpectaclesBonding(
            id: id,
            identifier: identifier,
            deviceId: deviceId,
            lensId: lensId,
            publicKey: nil,
            keyAlgorithm: nil
        )
        return bonding
    }

    private func resolveUnBindURL(_ url: URL) throws -> Bool {
        // specskitapp://specs-kit/unbind?
        // - status ($status)
        guard
            let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
            let queryItems = components.queryItems
        else {
            throw BondingResultFetcherError.invalidDeeplinkFormat
        }

        // Extract values from the query parameters
        func getQueryValue(for name: String) -> String? {
            return queryItems.first(where: { $0.name == name })?.value
        }

        guard let status = getQueryValue(for: "status") else {
            throw BondingResultFetcherError.invalidDeeplinkFormat
        }

        return status == "0" ? true : false
    }

    @MainActor
    private func performDeeplink(request: URL, deeplinkAsyncStream: AsyncStream<URL>) async throws -> URL {
        Log.info("Deeplinking to Spectacles app with url: \(request)")
        guard await urlHandler.open(request) else {
            throw BondingResultFetcherError.openDeeplinkFailed
        }
        Log.info("Deeplinked to Spectacles app, waiting for response")

        let fetchTask = Task {
            for await url in deeplinkAsyncStream {
                Log.info("Deeplink response received: \(url)")
                return url
            }
            Log.info("Timed out waiting for deeplink response")
            throw BondingResultFetcherError.timeout
        }

        let timeoutTask = Task {
            try await Task.sleep(nanoseconds: UInt64(timeOutSeconds) * NSEC_PER_SEC)
            fetchTask.cancel()
        }
        defer { timeoutTask.cancel() }
        return try await fetchTask.value
    }

    @MainActor
    func unbind(bonding: SpectaclesBonding, deeplinkAsyncStream: AsyncStream<URL>) async throws {
        guard
            let request = createURL(action: .unbind(
                deviceId: bonding.deviceId,
                bondingId: bonding.identifier.assignedId
            ))
        else {
            throw BondingResultFetcherError.openDeeplinkFailed
        }

        let response = try await performDeeplink(request: request, deeplinkAsyncStream: deeplinkAsyncStream)
        if try !resolveUnBindURL(response) {
            throw BondingResultFetcherError.unbindResultError
        }
    }

    @MainActor
    func bind(request: BondingRequest, deeplinkAsyncStream: AsyncStream<URL>) async throws -> SpectaclesBonding {
        let (lensId, lensName): (String, String) = try {
            switch request {
            case .singleLens(let id): return (id, "")
            case .singleLensByName(let name): return ("", name)
            @unknown default: throw BondingResultFetcherError.spectaclesAppNotInstalled
            }
        }()

        guard let request = createURL(action: .bind(lensId: lensId, lensName: lensName)) else {
            throw BondingResultFetcherError.spectaclesAppNotInstalled
        }

        let response = try await performDeeplink(request: request, deeplinkAsyncStream: deeplinkAsyncStream)
        return try resolveBindURL(response, lensId: lensId)
    }
}

// Copyright © 2024 Snap, Inc. All rights reserved.

import Foundation

/// Builder protocol for BondingManager instances
public protocol Builder {
    /// Sets the client identiifer. Required
    @discardableResult
    func setIdentifier(_ identifier: ClientIdentifier) -> Self

    /// Sets the app version. Required
    @discardableResult
    func setVersion(_ version: String) -> Self

    /// Sets the authentication provider. Required
    @discardableResult
    func setAuth(_ auth: any Authentication) -> Self

    /**
     Sets the bluetooth adapter.

     Optional, defaulting to ``BluetoothAdapter/defaultInstance``
     */
    @discardableResult
    func setBluetoothAdaptor(_ bluetoothAdapter: BluetoothAdapter) -> Self

    /// Builds the instance. Crashes if any required properties are missing
    func build() -> any BondingManager
}

public enum BuilderFactory {
    /// Creates an opaque instance of the builder
    public static func create() -> some Builder {
        BuilderImplementation()
    }
}

// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "SpectaclesKit",
    platforms: [
        .iOS(.v15),
    ],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "SpectaclesKit",
            targets: ["SpectaclesKit"]
        ),
        .library(
            name: "SpectaclesKitDynamic",
            type: .dynamic,
            targets: ["SpectaclesKit"]
        ),
        .library(
            name: "SpectaclesKitStatic",
            type: .static,
            targets: ["SpectaclesKit"]
        ),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "SpectaclesKit",
            dependencies: [],
            path: "Sources",
            resources: [
                .process("Resources/avalon_root.der"),
                .process("Resources/avalon_dev_root.der"),
            ]
        ),
        .testTarget(
            name: "SpectaclesKitTests",
            dependencies: ["SpectaclesKit"],
            path: "Tests/SpectaclesKitTests",
            resources: [
                .process("Resources/specs0.der"),
                .process("Resources/specs1.der"),
                .process("Resources/specs2.der"),
                .process("Resources/specs3.der"),
                .process("Resources/avalon_dev_root.der"),
                .process("Resources/avalon_root.der"),
            ]
        ),
    ]
)

let swiftSettings = [
    // StrictConcurrency is experimental in 5.10 and below
    SwiftSetting.enableExperimentalFeature("StrictConcurrency"),
    SwiftSetting.enableUpcomingFeature("StrictConcurrency"),

    SwiftSetting.enableUpcomingFeature("ConciseMagicFile"),
    SwiftSetting.enableUpcomingFeature("ForwardTrailingClosures"),
    SwiftSetting.enableUpcomingFeature("BareSlashRegexLiterals"),
    SwiftSetting.enableUpcomingFeature("DeprecateApplicationMain"),
    SwiftSetting.enableUpcomingFeature("ImportObjcForwardDeclarations"),
    SwiftSetting.enableUpcomingFeature("DisableOutwardActorInference"),
    SwiftSetting.enableUpcomingFeature("IsolatedDefaultValues"),
    SwiftSetting.enableUpcomingFeature("GlobalConcurrency"),
    SwiftSetting.enableUpcomingFeature("InferSendableFromCaptures"),
    SwiftSetting.enableUpcomingFeature("ImplicitOpenExistentials"),
    SwiftSetting.enableUpcomingFeature("RegionBasedIsolation"),
    SwiftSetting.enableUpcomingFeature("DynamicActorIsolation"),
    SwiftSetting.enableUpcomingFeature("NonfrozenEnumExhaustivity"),
    SwiftSetting.enableUpcomingFeature("GlobalActorIsolatedTypesUsability"),
    SwiftSetting.enableUpcomingFeature("ExistentialAny"),
    SwiftSetting.enableUpcomingFeature("InternalImportsByDefault"),
]
for target in package.targets {
    target.swiftSettings = swiftSettings
}

// Copyright © 2024 Snap, Inc. All rights reserved.

@testable import SpectaclesKit
import XCTest

final class StreamIdTests: XCTestCase {
    func testStreamIds() {
        var testId = StreamId(counter: 50, isClientInitiated: true)
        XCTAssertEqual(testId.rawValue, 101)
        XCTAssertTrue(testId.isClientInitiated)
        XCTAssertEqual(testId.counter, 50)

        testId.isClientInitiated = false
        XCTAssertEqual(testId.rawValue, 100)
        XCTAssertFalse(testId.isClientInitiated)
        XCTAssertEqual(testId.counter, 50)

        testId.counter = 30
        XCTAssertEqual(testId.rawValue, 60)
        XCTAssertFalse(testId.isClientInitiated)
        XCTAssertEqual(testId.counter, 30)

        testId.isClientInitiated = true
        XCTAssertEqual(testId.rawValue, 61)
        XCTAssertTrue(testId.isClientInitiated)
        XCTAssertEqual(testId.counter, 30)
    }
}

// Copyright © 2024 Snap, Inc. All rights reserved.
@testable import SpectaclesKit
import XCTest

final class TestDataSource: SMKPDataSource {
    var data: Data

    init(data: Data) {
        self.data = data
    }

    func receiveVarInt() async throws -> Int {
        try data.dequeueVarInt()
    }

    func receive(exactLength: Int) async throws -> Data {
        try data.dequeueData(count: exactLength)
    }
}

final class SMKPMessageTest: XCTestCase {
    private let versionKey = "v"
    private let totalSizeKey = "s"

    private let fileNotModifiedStatus = 304
    private let sampleData = Data([0xAA, 0xBB, 0xCC, 0xDD])

    func testResponseWithHeader() async throws {
        var header = SMKPMessageHeader()
        header.setHeaderStringValue(versionKey, value: "1.0")
        header.setHeaderIntValue(totalSizeKey, value: sampleData.count)
        let message = SMKPMessage(
            startLine: .response(type: .response, status: 0),
            header: header,
            body: sampleData
        )

        let encodeBuffer = try TestDataSource(data: message.encode())
        let newMessage = try await SMKPMessage.receiveMessage(from: encodeBuffer)
        XCTAssertEqual(newMessage, message)
    }

    func testResponseWithoutHeader() async throws {
        let message = SMKPMessage(
            startLine: .response(type: .response, status: fileNotModifiedStatus),
            header: nil,
            body: sampleData
        )

        let encodeBuffer = try TestDataSource(data: message.encode())
        let newMessage = try await SMKPMessage.receiveMessage(from: encodeBuffer)
        XCTAssertEqual(newMessage, message)
    }

    func testRequest() async throws {
        let message = SMKPMessage(
            startLine: .request(type: .call, path: "~/Dev/test.png"),
            header: nil,
            body: sampleData
        )

        let encodeBuffer = try TestDataSource(data: message.encode())
        let newMessage = try await SMKPMessage.receiveMessage(from: encodeBuffer)
        XCTAssertEqual(newMessage, message)
    }

    func testEmptyBody() async throws {
        var header = SMKPMessageHeader()
        header.setHeaderIntValue(totalSizeKey, value: 0)
        let message = SMKPMessage(
            startLine: .response(type: .response, status: 404),
            header: nil,
            body: Data()
        )

        let encodeBuffer = try TestDataSource(data: message.encode())
        let newMessage = try await SMKPMessage.receiveMessage(from: encodeBuffer)
        XCTAssertEqual(newMessage, message)
    }
}

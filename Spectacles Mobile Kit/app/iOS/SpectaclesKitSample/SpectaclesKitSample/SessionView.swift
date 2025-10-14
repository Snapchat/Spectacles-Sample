// Copyright © 2024 Snap, Inc. All rights reserved.
import SwiftUI

struct SessionView: View {
    @EnvironmentObject private var model: Model
    var bonding: BondingData

    @State private var sendMessage: String = "Hello from mobile"

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading) {
                Text(bonding.id)
                    .font(.headline)

                Button(model.sessionStarted ? "Stop Session" : "Start Session") {
                    if model.sessionStarted {
                        model.stopSession()
                    } else {
                        model.startSession(binding: bonding)
                    }
                }.buttonStyle(.bordered)

                // Label for sending message
                Text("Send Message:")
                    .font(.subheadline)
                    .padding(.bottom, 4)

                // Sending message TextEditor
                TextEditor(text: $sendMessage)
                    .frame(minHeight: 80)
                    .padding(8)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .shadow(radius: 2)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.gray.opacity(0.5)))
                    .padding(.bottom, 8)

                // Send Button below the TextEditor
                Button(action: {
                    model.onSendMessage(message: sendMessage)
                    sendMessage = "" // Clear message after sending
                    hideKeyboard()
                }) {
                    Text("Send")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .foregroundColor(.white)
                        .background(Color.blue)
                        .cornerRadius(8)
                }
                .padding(.bottom, 16)

                // Receiving message TextEditor (read-only)
                Text("Received Message:")
                    .font(.subheadline)
                    .padding(.bottom, 4)
                TextEditor(text: $model.receivedMessage)
                    .frame(minHeight: 100)
                    .padding(8)
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                    .shadow(radius: 2)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.gray.opacity(0.5)))
                    .disabled(true)
                    .padding(.bottom, 16)
                Spacer()
            }
            .padding(.top, 20)
            .padding(.horizontal, 16)
        }
    }

    private func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}

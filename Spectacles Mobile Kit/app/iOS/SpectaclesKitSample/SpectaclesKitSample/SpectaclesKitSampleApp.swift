// Copyright © 2024 Snap, Inc. All rights reserved.

import SwiftUI

@main
struct SpectaclesKitSampleApp: App {
    @StateObject private var model = Model()

    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(model).onOpenURL(perform: handleURL)
        }
    }

    func handleURL(_ url: URL) {
        model.pushDeeplinkURL(url: url)
    }
}

// The main ContentView
struct ContentView: View {
    @EnvironmentObject private var model: Model

    var body: some View {
        NavigationView {
            VStack {
                Button("SpectaclesKit bind") {
                    model.bind()
                }.font(.body.bold()).padding().buttonStyle(.bordered)
                BondingList(bondings: $model.bondings)
            }
        }
    }
}

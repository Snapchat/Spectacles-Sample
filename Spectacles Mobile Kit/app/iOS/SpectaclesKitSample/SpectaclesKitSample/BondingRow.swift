// Copyright © 2024 Snap, Inc. All rights reserved.

import SpectaclesKit
import SwiftUI

struct BondingRow: View {
    @EnvironmentObject private var model: Model
    var bonding: BondingData

    var body: some View {
        HStack(spacing: 20) {
            VStack(alignment: .leading) {
                Text(bonding.id)
                    .font(.headline)
            }
            Button("unbind") {
                model.unbind(id: bonding.id)
            }.buttonStyle(.bordered)
        }
    }
}

struct BondingData: Bonding, Identifiable {
    let id: String
}

#Preview {
    BondingRow(bonding: BondingData(id: "Idxxxx"))
}

// Copyright © 2024 Snap, Inc. All rights reserved.

import SpectaclesKit
import SwiftUI

struct BondingList: View {
    @EnvironmentObject private var model: Model
    @Binding var bondings: [BondingData]

    var body: some View {
        List {
            ForEach(bondings) { bonding in
                NavigationLink(destination: SessionView(bonding: bonding)) {
                    BondingRow(bonding: bonding)
                }
            }
        }
    }
}

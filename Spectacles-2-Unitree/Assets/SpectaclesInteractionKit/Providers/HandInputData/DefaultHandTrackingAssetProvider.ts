import {Singleton} from "../../Decorators/Singleton"
import HandTrackingAssetProvider from "./HandTrackingAssetProvider"
import {HandType} from "./HandType"

const LEFT_HAND_ASSET = requireAsset("./LeftHandAsset.handTracking3D")
const RIGHT_HAND_ASSET = requireAsset("./RightHandAsset.handTracking3D")

/**
 * Implementation of the default hand tracking asset provider which is the default
 * asset from Lens Studio
 */
@Singleton
export default class DefaultHandTrackingAssetProvider
  implements HandTrackingAssetProvider
{
  public static getInstance: () => DefaultHandTrackingAssetProvider

  private leftHandAsset: HandTracking3DAsset
  private rightHandAsset: HandTracking3DAsset

  constructor() {
    this.leftHandAsset = LEFT_HAND_ASSET as HandTracking3DAsset
    this.rightHandAsset = RIGHT_HAND_ASSET as HandTracking3DAsset
  }

  /** @inheritdoc */
  get(handType: HandType): Asset {
    return handType === "left" ? this.leftHandAsset : this.rightHandAsset
  }
}

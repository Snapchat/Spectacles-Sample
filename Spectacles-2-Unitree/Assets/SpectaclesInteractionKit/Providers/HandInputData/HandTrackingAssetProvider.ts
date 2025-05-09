import {HandType} from "./HandType"

/**
 * Interface defining apis to retrieve hand tracking assets
 */
export default interface HandTrackingAssetProvider {
  /**
   * Returns the associated {@link Object3DAsset}
   *
   * @param handType the {@link HandType} for this asset
   */
  get(handType: HandType): Asset
}

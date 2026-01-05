import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {ScrollWindow} from "SpectaclesUIKit.lspkg/Scripts/Components/ScrollWindow/ScrollWindow"
import {ASRQueryController} from "./ASRQueryController"
import {MusicGenerator} from "./MusicGenerator"
import {PromptObject} from "./PromptObject"
@component
export class SelectionController extends BaseScriptComponent {
  @input
  scrollObjectParent: SceneObject

  @input
  scrollWindow: ScrollWindow

  @input
  _generateButton: RectangleButton

  @input
  musicGenerator: MusicGenerator

  @input
  asrController: ASRQueryController

  private _promptObjectPrefab: ObjectPrefab = requireAsset("../Prefabs/PromptObj.prefab") as ObjectPrefab

  private _promptObjects: PromptObject[] = []
  private _activeItems: {
    prompt: string
    emoji: string
    component: PromptObject
  }[] = []
  private _animatingOut: Set<PromptObject> = new Set()

  private _generateBaseScale: vec3
  private _cancelGenerateAnim: (() => void) | null = null
  private _isGenerateVisible: boolean = false
  private _minScrollHeight: number = 0

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.scrollWindow.initialize()
      this.scrollWindow.addObject(this.scrollObjectParent)
      // Cache initial viewport height as the minimum scroll height
      this._minScrollHeight = 0 //this.scrollWindow.getScrollDimensions().y;
      this.createObjectPool()
      // Cache base scale for generate button animations
      const so = this._generateButton.getSceneObject()
      const tr = so.getTransform()
      this._generateBaseScale = tr.getLocalScale()
      // Start hidden
      tr.setLocalScale(this._generateBaseScale.uniformScale(0))
      so.enabled = false
      this._isGenerateVisible = false
      this._generateButton.onInitialized.add(() => {
        this._generateButton.onTriggerUp.add(this._onGenerate.bind(this))
      })
      if (this.asrController) {
        this.asrController.onQueryEvent.add((query) => {
          if (query && query.length > 0) {
            this.addToList(query, "🎤")
          }
        })
      }
    })
  }

  addToList(prompt: string, emoji: string) {
    // Don't add if already present
    const existingIndex = this._activeItems.findIndex((item) => item.prompt === prompt)
    if (existingIndex !== -1) {
      return
    }

    // Acquire a free pooled object
    const freeComponent = this._getAvailablePromptObject()
    if (!freeComponent) {
      return
    }

    freeComponent.setPrompt(prompt, this._formatDisplayText(prompt, emoji))
    this._activeItems.push({prompt, emoji, component: freeComponent})
    this._sortAndLayoutActiveItems()
    this._updateGenerateButtonEnabled()
    // Auto-scroll to bottom when a new item is added
    this.scrollWindow.scrollPositionNormalized = new vec2(0, -1)
  }

  removeFromList(prompt: string, animate: boolean = true) {
    const index = this._activeItems.findIndex((item) => item.prompt === prompt)
    if (index === -1) {
      return
    }

    const item = this._activeItems[index]
    if (animate) {
      // Start exit animation and defer removal until animation completes
      this._animatingOut.add(item.component)
      item.component.hide()
      return
    }
    // Immediate removal path
    this._activeItems.splice(index, 1)
    this._sortAndLayoutActiveItems()
    this._updateGenerateButtonEnabled()
    this.scrollWindow.scrollPositionNormalized = new vec2(0, -1)
  }

  public onPromptHidden(component: PromptObject) {
    if (!this._animatingOut.has(component)) {
      return
    }
    this._animatingOut.delete(component)
    // Remove the corresponding item now that animation finished
    const idx = this._activeItems.findIndex((it) => it.component === component)
    if (idx !== -1) {
      this._activeItems.splice(idx, 1)
    }
    // Finalize hidden state
    component.hide(true)
    // Now compact the list and update button state
    this._sortAndLayoutActiveItems()
    this._updateGenerateButtonEnabled()
    this.scrollWindow.scrollPositionNormalized = new vec2(0, -1)
  }

  private createObjectPool() {
    const scrollHeight = this.scrollWindow.scrollDimensions.y
    for (let i = 0; i < 30; i++) {
      const promptObject = this._promptObjectPrefab.instantiate(this.scrollObjectParent)
      const promptObjectComponent = promptObject.getComponent(PromptObject.getTypeName())
      promptObjectComponent.init(this)
      this._promptObjects.push(promptObjectComponent)
      promptObjectComponent.hide(true)
    }
    this.scrollWindow.scrollPositionNormalized = new vec2(0, -1)
    this._updateGenerateButtonEnabled()
  }

  private _getAvailablePromptObject(): PromptObject | null {
    for (let i = 0; i < this._promptObjects.length; i++) {
      const candidate = this._promptObjects[i]
      const isInUse = this._activeItems.some((item) => item.component === candidate)
      if (!isInUse) {
        return candidate
      }
    }
    return null
  }

  private _sortAndLayoutActiveItems() {
    // First compute the required vertical scroll height based on active items
    const baseDims = this.scrollWindow.scrollDimensions
    const spacing = 0.5 // Tight spacing between items
    const bottomMargin = 2 // Match layout bottom offset
    const topMargin = 2 // Small top padding for aesthetics
    // Only count items that are not currently animating out
    const visibleActiveItems = this._activeItems.filter((it) => !this._animatingOut.has(it.component))
    let contentHeight = 0
    for (let i = 0; i < visibleActiveItems.length; i++) {
      contentHeight += visibleActiveItems[i].component.getHeight()
      if (i > 0) {
        contentHeight += spacing
      }
    }
    const minHeight = this._minScrollHeight
    const requiredHeight = Math.max(minHeight, contentHeight + bottomMargin + topMargin)
    // Update scroll dimensions keeping width unchanged
    this.scrollWindow.scrollDimensions = new vec2(baseDims.x, requiredHeight)

    // Layout from bottom to top, newest at the bottom using updated height
    const scrollHeight = this.scrollWindow.scrollDimensions.y
    const bottomY = -scrollHeight / 2 + bottomMargin
    const offscreenY = scrollHeight / 2 + 1000
    let currentY = bottomY

    // Position active items contiguously with tight spacing
    for (let i = visibleActiveItems.length - 1; i >= 0; i--) {
      const comp = visibleActiveItems[i].component
      const height = comp.getHeight()
      comp.sceneObject.getTransform().setLocalPosition(new vec3(0, currentY, 0))
      currentY += height + spacing
    }

    // Move inactive pooled objects offscreen to avoid any interference
    for (let i = 0; i < this._promptObjects.length; i++) {
      const comp = this._promptObjects[i]
      const isActive = this._activeItems.some((item) => item.component === comp)
      const isAnimatingOut = this._animatingOut.has(comp)
      if (!isActive && !isAnimatingOut) {
        comp.sceneObject.getTransform().setLocalPosition(new vec3(0, offscreenY, 0))
      }
    }
  }

  private _formatDisplayText(prompt: string, emoji: string): string {
    if (emoji && emoji.length > 0) {
      return emoji + " " + prompt
    }
    return prompt
  }

  private _onGenerate() {
    if (!this._activeItems.length || !this.musicGenerator) {
      return
    }
    const genres = this._activeItems.map((item) => item.prompt)
    this.musicGenerator.createMusicObject(genres)

    // Reset list
    for (let i = 0; i < this._activeItems.length; i++) {
      this._activeItems[i].component.hide()
    }
    this._activeItems = []
    this._sortAndLayoutActiveItems()
    this._updateGenerateButtonEnabled()
    this.scrollWindow.scrollPositionNormalized = new vec2(0, -1)
  }

  private _updateGenerateButtonEnabled() {
    if (!this._generateButton) {
      return
    }
    const hasItems = this._activeItems.length > 0
    const so = this._generateButton.getSceneObject()
    const tr = so.getTransform()
    if (!this._generateBaseScale) {
      this._generateBaseScale = tr.getLocalScale()
    }
    if (hasItems && !this._isGenerateVisible) {
      // Transition: hidden -> visible
      if (this._cancelGenerateAnim) {
        this._cancelGenerateAnim()
        this._cancelGenerateAnim = null
      }
      so.enabled = true
      tr.setLocalScale(this._generateBaseScale.uniformScale(0))
      this._cancelGenerateAnim = animate({
        duration: 0.5,
        easing: "ease-out-back-cubic",
        update: (t: number) => {
          tr.setLocalScale(this._generateBaseScale.uniformScale(t))
        }
      })
      this._isGenerateVisible = true
    } else if (!hasItems && this._isGenerateVisible) {
      // Transition: visible -> hidden (animate out)
      if (this._cancelGenerateAnim) {
        this._cancelGenerateAnim()
        this._cancelGenerateAnim = null
      }
      const base = this._generateBaseScale || new vec3(1, 1, 1)
      this._cancelGenerateAnim = animate({
        duration: 0.5,
        easing: "ease-in-back-cubic",
        update: (t: number) => {
          const k = 1 - t
          tr.setLocalScale(base.uniformScale(k))
        },
        ended: () => {
          so.enabled = false
          this._isGenerateVisible = false
          this._cancelGenerateAnim = null
        }
      })
    }
  }
}

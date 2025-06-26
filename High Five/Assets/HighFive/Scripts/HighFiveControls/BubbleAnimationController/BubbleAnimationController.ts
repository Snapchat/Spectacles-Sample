import {animateToAlpha, setAlpha} from "../../Utils/SharedFunctions"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {BubbleAnimationControllerInput} from "./BubbleAnimationControllerInput"

// The BubbleAnimationController class manages the animations and visual effects for the bubble
// that appears during a high-five interaction
export class BubbleAnimationController {

  // Properties for managing bubble animation
  private bubbleMat: Material

  private glowMat: Material

  private initialized: boolean = false

  private bubbleTransform: Transform

  // Initializes the bubble and sets initial properties
  constructor(private readonly input: BubbleAnimationControllerInput) {
    this.bubbleTransform = this.input.overallBubble.getTransform()
    this.input.overallBubble.enabled = false
    setAlpha(this.input.wasHighFiveText.getSceneObject(), 0)
  }

  // Plays the bubble animation with a message and optional completion callback
  playBubbleAnimation(friendName: string, onComplete: () => void) {
    this.resetBubble()
    this.input.overallBubble.enabled = true
    this.input.wasHighFiveText.text = "HIGH FIVE!\nfrom " + friendName
    this.initialize(this.pinchAnimation)
    const del = this.input.createEvent("DelayedCallbackEvent")
    del.bind(() => {
      this.pop(onComplete)
    })
    del.reset(6)
  }

  // Sets the position of the bubble in the scene
  setPosition(pos: vec3) {
    this.bubbleTransform.setWorldPosition(pos)
  }

  // Handles the popping animation of the bubble
  pop = (onComplete: () => void) => {

    animate({
      update: (value: number) => {
        this.input.modelRim.mainPass["alpha"] = value
        this.glowMat.mainPass["alpha"] = Math.min(this.glowMat.mainPass["alpha"], 1 - value)
        this.glowMat.mainPass["radius"] = value
      },
      start: 0,
      end: 1,
      duration: 0.25,
      easing: "ease-out-cubic",
      ended: ()=> {

        animate({
          update: (value: number) => {
            this.bubbleMat.mainPass["alpha"] = 1
            this.bubbleMat.mainPass["dissipation"] = value
            this.glowMat.mainPass["alpha"] = Math.min(this.glowMat.mainPass["alpha"], 1 - value)
          },
          start: 0,
          end: 1,
          duration: 1,
          easing: "ease-out-cubic",
          ended: onComplete
        })

      }
    })

    animateToAlpha(this.input.wasHighFiveText.getSceneObject(), 1, 0, 1)
  }

  // Initializes materials and scales for the bubble
  initialize = (onComplete: () => void) => {
    let delay = this.input.createEvent("DelayedCallbackEvent")
    delay.bind(()=>{
      // Clone and set the materials
      this.input.modelRim = this.input.modelRim.clone();
      this.bubbleMat = this.input.bubbleSphere.mainMaterial.clone()
      this.input.bubbleSphere.clearMaterials()
      this.input.bubbleSphere.mainMaterial = this.bubbleMat
      this.glowMat = this.input.outerGlow.mainMaterial.clone()
      this.input.outerGlow.clearMaterials()

      this.initialized = true;

      this.input.outerGlow.mainMaterial = this.glowMat
      this.setColor(this.input.colorID)
      this.glowMat.mainPass["alpha"] = 0;
      this.glowMat.mainPass["flash"] = 0;
      this.input.bubbleSphere.getTransform().setLocalScale(vec3.one())
    })
    delay.reset(0.01)

    this.input.overallBubble.getTransform().setLocalScale(vec3.zero())

    const transform = this.input.overallBubble.getTransform()
    const initialScale = transform.getLocalScale()
    const toScale = vec3.one().uniformScale(2.5)
    animate({
      update: (value: number) => {
        transform.setLocalScale(vec3.lerp(initialScale, toScale, value))
      },
      start: 0,
      end: 1,
      duration: 1,
      easing: "ease-in-cubic",
      ended: onComplete
    })

    animateToAlpha(this.input.wasHighFiveText.getSceneObject(), 0, 1, 1)

  }

  // Sets the color of the bubble and its components based on the color ID
  setColor = (colorID: number) => {
    if(!this.initialized){ return }
    this.input.colorID = colorID;
    this.input.modelRim.mainPass["colorIndex"] = colorID
    this.bubbleMat.mainPass["colorIndex"] = colorID
    this.input.outerGlow.mainPass["colorIndex"] = colorID
  }

  // Resets the bubble to its initial state
  resetBubble = () => {
    if(!this.initialized){ return }
    this.bubbleMat.mainPass["alpha"] = 0
    this.bubbleMat.mainPass["dissipation"] = 0
  }

  // Executes a pinch animation for the bubble
  pinchAnimation = () => {
    if(!this.initialized){ return }
    this.input.overallBubble.enabled = true
    this.bubbleMat.mainPass["startState"] = 1
    this.bubbleMat.mainPass["currTime"] = getTime()
    animate({
      update: (value: number) => {
        this.bubbleMat.mainPass["radcentertransp"] = value
        this.glowMat.mainPass["radius"] = value
        this.glowMat.mainPass["alpha"] = value
        this.bubbleMat.mainPass["alpha"] = Math.max(this.bubbleMat.mainPass["alpha"], value)
      },
      start: 0,
      end: 1,
      duration: 0.5,
      easing: "ease-out-cubic"
    })
  }
}

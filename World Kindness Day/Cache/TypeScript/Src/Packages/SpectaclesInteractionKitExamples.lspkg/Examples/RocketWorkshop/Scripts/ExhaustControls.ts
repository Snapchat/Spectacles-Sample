/**
 * This class manages the exhaust and smoke effects for a scene. It initializes the materials and VFX components for the exhausts and smokes, and provides methods to control their states.
 *
 */
@component
export class ExhaustControls extends BaseScriptComponent {
  @input
  exhausts: SceneObject[] = []

  @input
  smokes: SceneObject[] = []

  private exhaustFireMaterials: Material[] = []
  private exhaustGlowMaterials: Material[] = []
  private smokeVFXs: VFXComponent[] = []

  onAwake(): void {
    this.initExhaustMaterials()
    this.initSmokeVFXs()
    this.turnOffExhausts()
    this.turnOffSmokes()
  }

  initExhaustMaterials = (): void => {
    for (let i = 0; i < this.exhausts.length; i++) {
      this.exhaustFireMaterials.push(this.exhausts[i].getChild(0).getComponent("RenderMeshVisual").mainMaterial)

      this.exhaustGlowMaterials.push(
        this.exhausts[i].getChild(0).getChild(0).getComponent("RenderMeshVisual").mainMaterial
      )
    }
  }

  initSmokeVFXs = (): void => {
    for (let i = 0; i < this.smokes.length; i++) {
      this.smokeVFXs.push(this.smokes[i].getComponent("Component.VFXComponent"))
    }
  }

  engineReady = (): void => {
    for (let i = 0; i < this.exhausts.length; i++) {
      this.exhausts[i].enabled = true
      this.exhaustFireMaterials[i].mainPass.fire_scale = 1.0
      this.exhaustGlowMaterials[i].mainPass.glow_scale = 1.0
    }
  }

  turnOnExhausts = (): void => {
    for (let i = 0; i < this.exhausts.length; i++) {
      this.exhausts[i].enabled = true
      this.exhaustFireMaterials[i].mainPass.fire_scale = 0.15
      this.exhaustGlowMaterials[i].mainPass.glow_scale = 0.15
    }
  }

  turnOffExhausts = (): void => {
    for (let i = 0; i < this.exhausts.length; i++) {
      this.exhausts[i].enabled = false
      this.exhaustFireMaterials[i].mainPass.fire_scale = 0.0
      this.exhaustGlowMaterials[i].mainPass.glow_scale = 0.0
    }
  }

  turnOnSmokes = (): void => {
    for (let i = 0; i < this.smokes.length; i++) {
      this.smokes[i].enabled = true
    }
  }

  turnOffSmokes = (): void => {
    for (let i = 0; i < this.smokes.length; i++) {
      this.smokes[i].enabled = false
    }
  }

  setEngineSmokesValue = (value: any): void => {
    for (let i = 0; i < this.smokes.length; i++) {
      const particles: any = this.smokeVFXs[i].asset.properties
      particles["particlesReduce"] = value
    }
  }
}

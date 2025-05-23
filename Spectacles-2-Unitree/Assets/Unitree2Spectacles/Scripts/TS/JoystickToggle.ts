@component
export class JoystickToggle extends BaseScriptComponent {

    @input joystick: SceneObject
    @input joystickPlane: SceneObject

     awake() {
        this.joystickPlane.enabled = false;
        this.joystick.enabled = false;
    }

    // Function to toggle the world query's enabled state
    toggleJoystick() {
        print("Toggle function called!");
        // If currently enabled, disable it; if disabled, enable it
        this.joystick.enabled = !this.joystick.enabled;
        this.joystickPlane.enabled = !this.joystickPlane.enabled;
    }

}
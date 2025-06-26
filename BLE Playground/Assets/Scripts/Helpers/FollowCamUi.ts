@component
export class FollowCamUi extends BaseScriptComponent {
    @input
    cam: SceneObject

    private tr: Transform
    private camTr: Transform

    private updateEvent: UpdateEvent

    private uiCamDistance = 50
    private uiCamHeight = -9

    onAwake() {
        this.tr = this.getTransform();
        this.camTr = this.cam.getTransform();

        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(()=>this.onUpdate());
        this.updateEvent.enabled = true;
    }

    private onUpdate() {
        var camPos = this.camTr.getWorldPosition();
        var desiredPosition = camPos.add(
            this.camTr.forward.uniformScale(-this.uiCamDistance)
        );
        desiredPosition = desiredPosition.add(
            this.camTr.up.uniformScale(this.uiCamHeight)
        );
        this.tr.setWorldPosition(
            vec3.lerp(
                this.tr.getWorldPosition(),
                desiredPosition,
                getDeltaTime() * 10
            )
        );
        var desiredRotation = quat.lookAt(this.camTr.forward, vec3.up());
        this.tr.setWorldRotation(
            quat.slerp(
                this.tr.getWorldRotation(),
                desiredRotation,
                getDeltaTime() * 10
            )
        );
    }
}

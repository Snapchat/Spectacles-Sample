// import required modules
const WorldQueryModule = require("LensStudio:WorldQueryModule")
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;
const InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;
const EPSILON = 0.01;


@component
export class NewScript extends BaseScriptComponent {


    private primaryInteractor;
    private hitTestSession: HitTestSession;
    private transform: Transform;
    @input
    indexToSpawn: number;

    @input
    targetObject: SceneObject;

    @input
    objectsToSpawn: SceneObject[];

    @input
    filterEnabled: boolean;

    onAwake() {
        // create new hit session
        this.hitTestSession = this.createHitTestSession(this.filterEnabled);
        if (!this.sceneObject) {
            print("Please set Target Object input");
            return;
        }
        this.transform = this.targetObject.getTransform();
        // disable target object when surface is not detected
        this.targetObject.enabled = false;
        this.setObjectEnabled(this.indexToSpawn)
        // create update event
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }


    createHitTestSession(filterEnabled) {
        // create hit test session with options
        var options = HitTestSessionOptions.create();
        options.filter = filterEnabled;


        var session = WorldQueryModule.createHitTestSessionWithOptions(options);
        return session;
    }


    onHitTestResult(results) {
        if (results === null) {
            this.targetObject.enabled = false;
        } else {
            this.targetObject.enabled = true;
            // get hit information
            const hitPosition = results.position;
            const hitNormal = results.normal;


            //identifying the direction the object should look at based on the normal of the hit location.


            var lookDirection;
            if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON) {
                lookDirection = vec3.forward();
            } else {
                lookDirection = hitNormal.cross(vec3.up());
            }


            const toRotation = quat.lookAt(lookDirection, hitNormal);
            //set position and rotation
            this.targetObject.getTransform().setWorldPosition(hitPosition);
            this.targetObject.getTransform().setWorldRotation(toRotation);


            if (
                this.primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
                this.primaryInteractor.currentTrigger === InteractorTriggerType.None
            ) {
                // Called when a trigger ends
                // Copy the plane/axis object
                let parent = this.objectsToSpawn[this.indexToSpawn].getParent();
                let newObject = parent.copyWholeHierarchy(this.objectsToSpawn[this.indexToSpawn]);
                newObject.setParentPreserveWorldTransform(null);
            }
        }
    }


    onUpdate() {
        this.primaryInteractor = SIK.InteractionManager.getTargetingInteractors().shift();


        if (this.primaryInteractor &&
            this.primaryInteractor.isActive() &&
            this.primaryInteractor.isTargeting()
        ) {
            const rayStartOffset = new vec3(this.primaryInteractor.startPoint.x, this.primaryInteractor.startPoint.y, this.primaryInteractor.startPoint.z + 30);
            const rayStart = rayStartOffset;
            const rayEnd = this.primaryInteractor.endPoint;


            this.hitTestSession.hitTest(rayStart, rayEnd, this.onHitTestResult.bind(this));


        } else {
            this.targetObject.enabled = false;
        }
    }

    setObjectIndex(i) {
        this.indexToSpawn = i;
    }

    setObjectEnabled(i) {
        for (let i = 0; i < this.objectsToSpawn.length; i++)
            this.objectsToSpawn[i].enabled = i == this.indexToSpawn;
    }
}

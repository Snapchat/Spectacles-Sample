import { RobotDecoyController } from "./RobotDecoyController";

const WorldQueryModule = require("LensStudio:WorldQueryModule")
const SIK = require("SpectaclesInteractionKit/SIK").SIK;
const InteractorTriggerType = require("SpectaclesInteractionKit/Core/Interactor/Interactor").InteractorTriggerType;
const EPSILON = 0.01;


@component
export class SingleObjectRaycaster extends BaseScriptComponent {
    private primaryInteractor;
    private hitTestSession: HitTestSession;
    private transform: Transform;
    private targetInstance: SceneObject = null;

    @input
    targetObject: ObjectPrefab;

    @input
    objectToSpawn: ObjectPrefab;

    @input
    filterEnabled: boolean;

    @input
    isEnabled: boolean = true;  // New bool to enable/disable functionality

    @input('Component.ScriptComponent')
    decoyController: any;

    // For some reason changing the type of the above to RobotDecoyController -- or even just adding a commment to that line -- will cause the Lens to crash    
    
    @input
    objectsToCheck: SceneObject[];

    private spawnedObject: SceneObject = null;
    private hasSpawned: boolean = false;
    private updateEvent;
    private intersectingObjects: SceneObject[] = [];
    private isIntersectingWithOther: boolean = false;

    onAwake() {
        // create new hit session
        this.hitTestSession = this.createHitTestSession(this.filterEnabled);
        if (!this.targetObject) {
            print("Please set Target Object input");
            return;
        }

        // Instantiate the target object from prefab with no parent (same as objectToSpawn)
        this.targetInstance = this.targetObject.instantiate(null);
        this.transform = this.targetInstance.getTransform();

        // disable target object when surface is not detected
        this.targetInstance.enabled = false;

        // create update event
        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(this.onUpdate.bind(this));
    }

    createHitTestSession(filterEnabled) {
        // create hit test session with options
        var options = HitTestSessionOptions.create();
        options.filter = filterEnabled;

        var session = WorldQueryModule.createHitTestSessionWithOptions(options);
        return session;
    }

    onHitTestResult(results) {
        if (!this.isEnabled) {
            this.targetInstance.enabled = false;
            return;
        }

        if (results === null || this.isIntersectingWithOther) {
            this.targetInstance.enabled = false;
        } else {
            this.targetInstance.enabled = true;
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
            this.transform.setWorldPosition(hitPosition);
            this.transform.setWorldRotation(toRotation);

            // Only spawn or move on trigger release (click/tap)
            if (
                this.primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
                this.primaryInteractor.currentTrigger === InteractorTriggerType.None
            ) {
                if (!this.hasSpawned) {
                    // First time spawning - instantiate from prefab
                    this.spawnedObject = this.objectToSpawn.instantiate(null);
                    this.spawnedObject.getTransform().setWorldPosition(hitPosition);
                    this.spawnedObject.getTransform().setWorldRotation(toRotation);
                    this.hasSpawned = true;
                    // Call the decoy controller to update the robot's position
                    if (this.decoyController) {
                        this.decoyController.sendNewPositionToDecoy(hitPosition);
                    }
                } else {
                    // Already spawned, just move the existing object on click
                    if (this.spawnedObject) {
                        this.spawnedObject.getTransform().setWorldPosition(hitPosition);
                        this.spawnedObject.getTransform().setWorldRotation(toRotation);
                    }
                    // Call the decoy controller to update the robot's position
                    if (this.decoyController) {
                        this.decoyController.sendNewPositionToDecoy(hitPosition);
                    }
                }
            }
        }
    }

    onUpdate() {
        if (!this.isEnabled) {
            this.targetInstance.enabled = false;
            return;
        }

        this.primaryInteractor = SIK.InteractionManager.getTargetingInteractors().shift();

        if (this.primaryInteractor &&
            this.primaryInteractor.isActive() &&
            this.primaryInteractor.isTargeting()
        ) {
            const rayStartOffset = new vec3(this.primaryInteractor.startPoint.x, this.primaryInteractor.startPoint.y, this.primaryInteractor.startPoint.z + 30);
            const rayStart = rayStartOffset;
            const rayEnd = this.primaryInteractor.endPoint;

            // Clear previous intersections
            this.intersectingObjects = [];

            // Check for objects intersecting with the ray
            if (this.objectsToCheck && this.objectsToCheck.length > 0) {
                this.checkRayIntersections(rayStart, rayEnd);
            } else {
                print("[SingleObjectRaycaster] No objects to check for intersection");
            }

            this.hitTestSession.hitTest(rayStart, rayEnd, this.onHitTestResult.bind(this));
        } else {
            this.targetInstance.enabled = false;
        }
    }

    // Method to reset the spawned object if needed
    resetSpawnedObject() {
        if (this.spawnedObject) {
            this.spawnedObject.destroy();
            this.spawnedObject = null;
            this.hasSpawned = false;
        }
    }

    // Function to enable or disable the functionality
    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;

        if (!enabled) {
            // Hide the target instance when disabled
            this.targetInstance.enabled = false;
        }
    }

    // Function to toggle the enabled status
    toggleEnabled() {
        this.isEnabled = !this.isEnabled;

        if (!this.isEnabled) {
            // Hide the target instance when disabled
            this.targetInstance.enabled = false;
        }

        return this.isEnabled; // Return the new status if needed
    }

    // Check if a ray intersects with a plane centered at each object's position
    checkRayIntersections(rayStart: vec3, rayEnd: vec3) {
        // Direction of the ray
        const rayDirection = rayEnd.sub(rayStart).normalize();
        const rayLength = rayEnd.distance(rayStart);

        // Reset the intersecting objects array
        this.intersectingObjects = [];

        // Check each object in the objectsToCheck array
        for (let i = 0; i < this.objectsToCheck.length; i++) {
            const object = this.objectsToCheck[i];
            if (!object || !object.enabled) {
                continue;
            }

            // Get object's transform
            const objectTransform = object.getTransform();
            const objectPosition = objectTransform.getWorldPosition();
            const objectRotation = objectTransform.getWorldRotation();

            // Define the plane normal based on the object's rotation (using forward vector)
            let planeNormal = vec3.forward();
            planeNormal = objectRotation.multiplyVec3(planeNormal);
            planeNormal = planeNormal.normalize();

            // Calculate the dot product of ray direction and plane normal
            let dirDotNormal = rayDirection.x * planeNormal.x;
            dirDotNormal += rayDirection.y * planeNormal.y;
            dirDotNormal += rayDirection.z * planeNormal.z;

            // Check if ray is parallel to the plane (or nearly parallel)
            if (Math.abs(dirDotNormal) < 0.0001) {
                // Ray is parallel to the plane, no intersection
                continue;
            }

            // Calculate the vector from ray start to plane point
            const toPlane = new vec3(
                objectPosition.x - rayStart.x,
                objectPosition.y - rayStart.y,
                objectPosition.z - rayStart.z
            );

            // Calculate the dot product of toPlane and plane normal
            let planeDotNormal = toPlane.x * planeNormal.x;
            planeDotNormal += toPlane.y * planeNormal.y;
            planeDotNormal += toPlane.z * planeNormal.z;

            // Calculate the distance along the ray to the intersection point
            const t = planeDotNormal / dirDotNormal;

            // Check if intersection is within the ray segment
            if (t >= 0 && t <= rayLength) {
                // Calculate the intersection point
                const intersectionPoint = new vec3(
                    rayStart.x + rayDirection.x * t,
                    rayStart.y + rayDirection.y * t,
                    rayStart.z + rayDirection.z * t
                );

                // Check if the intersection point is within a rectangular area on the plane
                const objectScale = objectTransform.getWorldScale();

                // Define half-width and half-height of the rectangle
                const halfWidth = objectScale.x * 0.65;  // 65% of the object's width
                const halfHeight = objectScale.y * 0.65; // 65% of the object's height

                // Calculate the vector from object position to intersection point
                const toIntersection = new vec3(
                    intersectionPoint.x - objectPosition.x,
                    intersectionPoint.y - objectPosition.y,
                    intersectionPoint.z - objectPosition.z
                );

                // Calculate the component of toIntersection along the normal (perpendicular to plane)
                let normalComponent = toIntersection.x * planeNormal.x;
                normalComponent += toIntersection.y * planeNormal.y;
                normalComponent += toIntersection.z * planeNormal.z;

                // Calculate the vector along the normal
                const normalVector = new vec3(
                    planeNormal.x * normalComponent,
                    planeNormal.y * normalComponent,
                    planeNormal.z * normalComponent
                );

                // Calculate the component on the plane
                const planeComponent = new vec3(
                    toIntersection.x - normalVector.x,
                    toIntersection.y - normalVector.y,
                    toIntersection.z - normalVector.z
                );

                // Get the right vector (x-axis) of the object
                const rightVector = objectRotation.multiplyVec3(vec3.right()).normalize();

                // Get the up vector (y-axis) of the object
                const upVector = objectRotation.multiplyVec3(vec3.up()).normalize();

                // Project the plane component onto the right and up vectors to get local x and y coordinates
                let localX = planeComponent.x * rightVector.x;
                localX += planeComponent.y * rightVector.y;
                localX += planeComponent.z * rightVector.z;

                let localY = planeComponent.x * upVector.x;
                localY += planeComponent.y * upVector.y;
                localY += planeComponent.z * upVector.z;

                // Check if the point is within the rectangle
                if (Math.abs(localX) <= halfWidth && Math.abs(localY) <= halfHeight) {
                    // We have a hit within the rectangular area of the plane
                    this.intersectingObjects.push(object);
                    print("[RayIntersection] PLANE HIT: " + object.name + " at distance " + t);
                }
            }
        }

        this.isIntersectingWithOther = false;
        if (this.intersectingObjects.length > 0) {
            this.isIntersectingWithOther = true;
            print("[RayIntersection] Found " + this.intersectingObjects.length + " intersecting objects");
        }
        return this.intersectingObjects;
    }

    // Get the list of objects currently intersecting with the ray
    getIntersectingObjects(): SceneObject[] {
        return this.intersectingObjects;
    }
}

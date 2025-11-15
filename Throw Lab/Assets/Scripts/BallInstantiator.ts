/**
 * BallInstantiator - TypeScript component for Lens Studio
 * Instantiates ball prefabs at regular intervals and throws them using physics
 */
@component
export class BallInstantiator extends BaseScriptComponent {
    @input
    @hint("Prefab to instantiate")
    prefab!: ObjectPrefab;

    @input
    @hint("Spawn position - where balls spawn")
    spawnPosition!: SceneObject;

    @input
    @hint("Target position - direction to throw balls toward")
    targetPosition!: SceneObject;

    @input
    @hint("Time between spawning balls in seconds")
    spawnInterval: number = 2.0;

    @input
    @hint("Force magnitude to apply when throwing ball")
    throwForce: number = 500.0;

    @input
    @hint("Maximum lifetime of balls in seconds before auto-destruction")
    maxLifetime: number = 10.0;

    // Private variables
    private nextSpawnTime: number = 0;
    private activeBalls: Map<SceneObject, number> = new Map();

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });

        this.createEvent("UpdateEvent").bind(() => {
            this.onUpdate();
        });
    }

    onStart(): void {
        // Set the first spawn time to spawn immediately
        this.nextSpawnTime = getTime();
        print("Ball Instantiator started");
    }

    onUpdate(): void {
        // Check if it's time to spawn a new ball
        const currentTime = getTime();
        if (currentTime >= this.nextSpawnTime) {
            this.spawnBall();
            this.nextSpawnTime = currentTime + this.spawnInterval;
        }

        // Clean up old balls
        this.cleanupOldBalls(currentTime);
    }

    // Spawns a new ball and throws it using physics
    spawnBall(): void {
        if (!this.prefab || !this.spawnPosition || !this.targetPosition) {
            print("Error: Required inputs not assigned (prefab, spawnPosition, or targetPosition)");
            return;
        }

        // Instantiate the ball
        const ball = this.prefab.instantiate(this.sceneObject);
        if (!ball) {
            print("Failed to instantiate ball");
            return;
        }

        // Position the ball at the spawn position
        const spawnPos = this.spawnPosition.getTransform().getWorldPosition();
        ball.getTransform().setWorldPosition(spawnPos);

        // Calculate throw direction
        const targetPos = this.targetPosition.getTransform().getWorldPosition();
        const throwDirection = targetPos.sub(spawnPos).normalize();

        // Get the body component and apply impulse force
        const bodyComponent = ball.getComponent("Physics.BodyComponent");
        if (bodyComponent) {
            // Ensure body is dynamic
            (bodyComponent as any).dynamic = true;
            
            const forceVector = throwDirection.uniformScale(this.throwForce);
            print(`Throw direction: ${throwDirection.x.toFixed(2)}, ${throwDirection.y.toFixed(2)}, ${throwDirection.z.toFixed(2)}`);
            print(`Force vector: ${forceVector.x.toFixed(2)}, ${forceVector.y.toFixed(2)}, ${forceVector.z.toFixed(2)}`);
            
            (bodyComponent as any).addForce(forceVector, Physics.ForceMode.Impulse);
            print("Force applied to ball");
        } else {
            print("Warning: Ball has no BodyComponent, cannot apply force");
        }

        // Track this ball for cleanup
        this.activeBalls.set(ball, getTime());
        
        print(`Spawned ball at ${spawnPos.x.toFixed(2)}, ${spawnPos.y.toFixed(2)}, ${spawnPos.z.toFixed(2)}`);
    }

    // Clean up balls that have exceeded their lifetime
    cleanupOldBalls(currentTime: number): void {
        const ballsToRemove: SceneObject[] = [];

        // Check each ball's lifetime
        this.activeBalls.forEach((spawnTime, ball) => {
            if (!ball) {
                ballsToRemove.push(ball);
                return;
            }

            const lifetime = currentTime - spawnTime;
            if (lifetime > this.maxLifetime) {
                try {
                    ball.destroy();
                    ballsToRemove.push(ball);
                } catch (e) {
                    print("Error destroying ball: " + e);
                    ballsToRemove.push(ball);
                }
            }
        });

        // Remove destroyed balls from tracking
        for (const ball of ballsToRemove) {
            this.activeBalls.delete(ball);
        }
    }
}
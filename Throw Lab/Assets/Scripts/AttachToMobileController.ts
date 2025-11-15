import { SIK } from 'SpectaclesInteractionKit.lspkg/SIK';

@component
export class AttachToMobileController extends BaseScriptComponent {
    @input
    followPosition: boolean = true;

    @input
    followRotation: boolean = true;

    @input
    positionOffset: vec3 = vec3.zero();

    @input
    rotationOffset: quat = quat.quatIdentity();

    @input
    @hint("Lerp factor: 0 = instant/no smoothing, 0.1-0.3 = heavy smoothing/slow follow, 0.7-0.9 = light smoothing/fast follow, 1.0 = almost instant")
    smoothing: number = 0;

    private motionController: MotionController;
    private mobileInputData: typeof SIK.MobileInputData;
    private transform: Transform;

    onAwake() {
        this.transform = this.getTransform();

        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }

    onStart() {
        try {
            this.mobileInputData = SIK.MobileInputData;
            this.motionController = this.mobileInputData.motionController;

            if (!this.motionController) {
                print('AttachToMobileController: Motion controller not available. Mobile input may not be enabled.');
                return;
            }

            this.createEvent('UpdateEvent').bind(() => {
                this.onUpdate();
            });

        } catch (error) {
            print('AttachToMobileController: Error initializing mobile controller - ' + error);
        }
    }

    onUpdate() {
        if (!this.motionController || !this.transform) {
            return;
        }

        try {
            if (this.followPosition) {
                const targetPosition = this.motionController.getWorldPosition().add(this.positionOffset);
                
                if (this.smoothing > 0) {
                    const currentPosition = this.transform.getWorldPosition();
                    const smoothedPosition = vec3.lerp(currentPosition, targetPosition, this.smoothing);
                    this.transform.setWorldPosition(smoothedPosition);
                } else {
                    this.transform.setWorldPosition(targetPosition);
                }
            }

            if (this.followRotation) {
                const targetRotation = this.motionController.getWorldRotation().multiply(this.rotationOffset);
                
                if (this.smoothing > 0) {
                    const currentRotation = this.transform.getWorldRotation();
                    const smoothedRotation = quat.slerp(currentRotation, targetRotation, this.smoothing);
                    this.transform.setWorldRotation(smoothedRotation);
                } else {
                    this.transform.setWorldRotation(targetRotation);
                }
            }
        } catch (error) {
            print('AttachToMobileController: Error updating transform - ' + error);
        }
    }
}


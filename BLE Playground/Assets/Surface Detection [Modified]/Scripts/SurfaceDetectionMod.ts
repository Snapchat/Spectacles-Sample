/**
 * NOTE: this has been modified from the asset library Surface Detection version to accommodate spawning as multiple prefabs,
 * And to accommodate tracking any suface, not just a floor surface. 
 */

import { Logger } from 'Scripts/Helpers/Logger';
import { CircleAnimationMod } from './CircleAnimationMod';

@component
export class SurfaceDetectionMod extends BaseScriptComponent {
    @input
    @allowUndefined
    visualObj: SceneObject

    @input
    @allowUndefined
    animation: CircleAnimationMod

    private worldQueryModule = require("LensStudio:WorldQueryModule") as WorldQueryModule;

    // Set min and max hit distance to surfaces
    private readonly MAX_HIT_DISTANCE = 1000;
    private readonly MIN_HIT_DISTANCE = 50;

    // Number of frames before surface detection completes
    private readonly CALIBRATION_FRAMES = 26;

    // Distance in cm the surface visual can move before canceling
    private readonly MOVE_DISTANCE_THRESHOLD = 5;

    // Distance in cm from camera to visual when no surface is hit
    private readonly DEFAULT_SCREEN_DISTANCE = 200;

    private readonly SPEED = 10;

    private camTr:Transform;
    private visualTrans;

    private calibrationPosition = vec3.zero();
    private calibrationRotation = quat.quatIdentity();

    private desiredPosition = vec3.zero();
    private desiredRotation = quat.quatIdentity();

    private hitTestSession = null;
    private updateEvent = null;

    private history = [];
    private calibrationFrames = 0;

    private onGroundFoundCallback = null;

    private camObj: SceneObject

    init(camObj: SceneObject) {
        Logger.getInstance().log("SurfaceDetection init");

        this.camObj = camObj;

        if (!this.camObj) {
            print("Please set Camera Obj input");
            return;
        }
        this.camTr = this.camObj.getTransform();
        this.getTransform().setWorldPosition(this.camTr.getWorldPosition().add(this.camTr.back.uniformScale(120)));

        this.visualTrans = this.visualObj.getTransform();
        this.visualObj.enabled = false;

        try {
            const options = HitTestSessionOptions.create();
            options.filter = true;
            this.hitTestSession = this.worldQueryModule.createHitTestSessionWithOptions(options);
        } catch (e) {
            print(e);
        }

        this.createEvent("OnStartEvent").bind(() => {
            this.setDefaultPosition();
        });
    }

    startGroundCalibration(callback: (pos: vec3, rot: quat) => void) {
        Logger.getInstance().log("SurfaceDetection startGroundCalibration");

        this.setDefaultPosition();
        this.hitTestSession?.start();
        this.visualObj.enabled = true;
        this.history = [];
        this.calibrationFrames = 0;
        this.onGroundFoundCallback = callback;
        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(() => {
            this.update();
        });
        this.animation.startCalibration(() => {
            this.onCalibrationComplete()
        });
    }

    private setDefaultPosition() {
        this.desiredPosition = this.camTr.getWorldPosition().add(this.camTr.forward.uniformScale(-this.DEFAULT_SCREEN_DISTANCE));
        this.desiredRotation = this.camTr.getWorldRotation();
        this.visualTrans.setWorldPosition(this.desiredPosition);
        this.visualTrans.setWorldRotation(this.desiredRotation);
    }

    private update() {
        const rayDirection = this.camTr.forward;
        rayDirection.y += .1;
        const camPos = this.camTr.getWorldPosition();
        const rayStart = camPos.add(rayDirection.uniformScale(-this.MIN_HIT_DISTANCE));
        const rayEnd = camPos.add(rayDirection.uniformScale(-this.MAX_HIT_DISTANCE));
        this.hitTestSession.hitTest(rayStart, rayEnd, (hitTestResult) => {
            this.onHitTestResult(hitTestResult);
        });
    }

    private onHitTestResult(hitTestResult) {
        let foundPosition = vec3.zero();
        let foundNormal = vec3.zero();
        if (hitTestResult != null) {
            foundPosition = hitTestResult.position;
            foundNormal = hitTestResult.normal;
        }
        this.updateCalibration(foundPosition, foundNormal);
    }

    private updateCalibration(foundPosition: vec3, foundNormal: vec3) {
        const currPosition = this.visualTrans.getWorldPosition();
        const currRotation = this.visualTrans.getWorldRotation();

        this.desiredPosition = this.camTr.getWorldPosition().add(this.camTr.forward.uniformScale(-this.DEFAULT_SCREEN_DISTANCE));
        // We don't care about rotation, so I just keep the ui facing the camera, irrespective of normal.
        this.desiredRotation = this.camTr.getWorldRotation();

        // We don't care about rotation, so I took this normal check out. 
        this.desiredPosition = foundPosition;

        this.history.push(this.desiredPosition);
        if (this.history.length > this.CALIBRATION_FRAMES) {
            this.history.shift();
        }
        const distance = this.history[0].distance(this.history[this.history.length - 1]);
        if (distance < this.MOVE_DISTANCE_THRESHOLD) {
            this.calibrationFrames++;
        } else {
            this.calibrationFrames = 0;
        }

        const calibrationAmount = this.calibrationFrames / this.CALIBRATION_FRAMES;

        this.animation.setLoadAmount(calibrationAmount);

        if (calibrationAmount == 1) {
            this.calibrationPosition = this.desiredPosition;
            const rotOffset = quat.fromEulerVec(new vec3(Math.PI / 2, 0, 0));
            this.calibrationRotation = this.desiredRotation.multiply(rotOffset);
            this.removeEvent(this.updateEvent);
        }

        //interpolate
        this.visualTrans.setWorldPosition(vec3.lerp(currPosition, this.desiredPosition, getDeltaTime() * this.SPEED));
        this.visualTrans.setWorldRotation(quat.slerp(currRotation, this.desiredRotation, getDeltaTime() * this.SPEED));
    }

    private onCalibrationComplete() {
        Logger.getInstance().log("SurfaceDetection onCalibrationComplete");

        this.hitTestSession?.stop();
        this.updateEvent.enabled = false;
        this.visualObj.enabled = false;
        this.onGroundFoundCallback?.(this.calibrationPosition, this.calibrationRotation);
    }
}

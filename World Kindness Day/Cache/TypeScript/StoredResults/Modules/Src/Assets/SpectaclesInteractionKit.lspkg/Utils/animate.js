"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationManager = exports.CancelSet = exports.easingFunctions = exports.onAnimationStop = exports.onAnimationStart = void 0;
exports.default = animate;
exports.mix = mix;
const Singleton_1 = require("../Decorators/Singleton");
const Event_1 = require("./Event");
const onAnimationStartEvent = new Event_1.default();
exports.onAnimationStart = onAnimationStartEvent.publicApi();
const onAnimationStopEvent = new Event_1.default();
exports.onAnimationStop = onAnimationStopEvent.publicApi();
exports.easingFunctions = {
    linear: (t) => t,
    "ease-in-sine": (t) => {
        return -Math.cos(t * (Math.PI / 2)) + 1;
    },
    "ease-out-sine": (t) => {
        return Math.sin(t * (Math.PI / 2));
    },
    "ease-in-out-sine": (t) => {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    },
    "ease-in-quad": (t) => {
        return t * t;
    },
    "ease-out-quad": (t) => {
        return t * (2 - t);
    },
    "ease-in-out-quad": (t) => {
        if ((t *= 2) < 1) {
            return 0.5 * t * t;
        }
        return -0.5 * (--t * (t - 2) - 1);
    },
    "ease-in-cubic": (t) => {
        return t * t * t;
    },
    "ease-out-cubic": (t) => {
        return --t * t * t + 1;
    },
    "ease-in-out-cubic": (t) => {
        if ((t *= 2) < 1) {
            return 0.5 * t * t * t;
        }
        return 0.5 * ((t -= 2) * t * t + 2);
    },
    "ease-in-quart": (t) => {
        return t * t * t * t;
    },
    "ease-out-quart": (t) => {
        return 1 - --t * t * t * t;
    },
    "ease-in-out-quart": (t) => {
        if ((t *= 2) < 1) {
            return 0.5 * t * t * t * t;
        }
        return -0.5 * ((t -= 2) * t * t * t - 2);
    },
    "ease-in-quint": (t) => {
        return t * t * t * t * t;
    },
    "ease-out-quint": (t) => {
        return --t * t * t * t * t + 1;
    },
    "ease-in-out-quint": (t) => {
        if ((t *= 2) < 1) {
            return 0.5 * t * t * t * t * t;
        }
        return 0.5 * ((t -= 2) * t * t * t * t + 2);
    },
    "ease-in-expo": (t) => {
        return t === 0 ? 0 : Math.pow(1024, t - 1);
    },
    "ease-out-expo": (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },
    "ease-in-out-expo": (t) => {
        if (t === 0 || t === 1) {
            return t;
        }
        if ((t *= 2) < 1) {
            return 0.5 * Math.pow(1024, t - 1);
        }
        return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
    },
    "ease-in-circ": (t) => {
        return 1 - Math.sqrt(1 - t * t);
    },
    "ease-out-circ": (t) => {
        return Math.sqrt(1 - --t * t);
    },
    "ease-in-out-circ": (t) => {
        if ((t *= 2) < 1) {
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    "ease-in-back": (t) => {
        const s = 1.70158;
        return t === 1 ? 1 : t * t * ((s + 1) * t - s);
    },
    "ease-out-back": (t) => {
        const s = 1.70158;
        return t === 0 ? 0 : --t * t * ((s + 1) * t + s) + 1;
    },
    "ease-in-out-back": (t) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
    "ease-in-elastic": (t) => {
        if (t === 0 || t === 1) {
            return t;
        }
        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },
    "ease-out-elastic": (t) => {
        if (t === 0 || t === 1) {
            return t;
        }
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    "ease-in-out-elastic": (t) => {
        if (t === 0 || t === 1) {
            return t;
        }
        t *= 2;
        if (t < 1) {
            return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
        }
        return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
    },
    "ease-in-bounce": (t) => {
        return 1 - exports.easingFunctions["ease-out-bounce"](1 - t);
    },
    "ease-out-bounce": (t) => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        }
        else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        }
        else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        }
        else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },
    "ease-in-out-bounce": (t) => {
        return t < 0.5
            ? exports.easingFunctions["ease-in-bounce"](t * 2) * 0.5
            : exports.easingFunctions["ease-out-bounce"](t * 2 - 1) * 0.5 + 0.5;
    },
    "ease-out-back-cubic": createCubicBezierEasingFunction(0.34, 1.25, 0.64, 1),
    "ease-in-back-cubic": createCubicBezierEasingFunction(0.36, 0, 0.64, -0.25),
    "ease-in-out-back-cubic": createCubicBezierEasingFunction(0.3, -0.25, 0.6, 1.42)
};
// A simple animation function. It's probably better to use the other animation
// utilities, but I need a quick way to animate that wasn't tied to Scene objects
function animate(config) {
    let running = true;
    let elapsedTime = 0;
    const easingFunction = exports.easingFunctions[config.easing ?? "linear"];
    const start = config.start ?? 0;
    const end = config.end ?? 1;
    const range = end - start;
    onAnimationStartEvent.invoke(config);
    // Create a function to be called for each frame
    function frame(delayFrames = 0) {
        // Bail out if this animation has been canceled
        if (!running) {
            onAnimationStopEvent.invoke(config);
            return;
        }
        const deltaTime = getDeltaTime();
        if (deltaTime === 0) {
            /**
             * Workaround for the fact that current capture implementation uses a double update,
             * which means that when in capture mode global update happens once, passing in
             * deltaTime of 0 on the second update.
             *
             * For reference see: https://docs.google.com/document/d/1NT_yadoaSFqWvVkeMCb2qs3Um4pTLfbnW9_ySubsBbw/edit
             *
             * This code simply skips all updates in the animate function when deltaTime is 0, ensuring
             * that the animation does not progress incorrectly when in capture mode.
             */
            AnimationManager.getInstance().requestAnimationFrame(() => frame(delayFrames));
            return;
        }
        // Time only passes after the delay frames
        if (delayFrames === 0) {
            elapsedTime += deltaTime;
        }
        // Calculate the raw and "eased" t
        let t;
        let ended = false;
        if (config.duration === "continuous") {
            // continuous animations run until canceled
            t = elapsedTime;
        }
        else {
            const rawT = Math.min(1.0, elapsedTime / config.duration);
            const easedT = easingFunction(rawT);
            t = start + easedT * range;
            ended = elapsedTime >= config.duration;
        }
        // perform the update
        config.update(t);
        if (ended === true) {
            running = false;
            config.ended?.();
        }
        // continue the animation
        AnimationManager.getInstance().requestAnimationFrame(() => frame(delayFrames === 0 ? 0 : delayFrames - 1));
    }
    // Create a Cancelation function to stop this animation at any time
    function cancel() {
        running = false;
        config.cancelled?.();
    }
    config.cancelSet?.add(cancel);
    frame(config.delayFrames ?? 0);
    return cancel;
}
exports.CancelSet = class {
    constructor(config) {
        let calls = [];
        function cancelSet() {
            for (const call of calls) {
                call();
            }
            calls = [];
            config?.onCancel?.();
        }
        cancelSet.cancel = cancelSet;
        cancelSet.add = (fn) => {
            calls.push(fn);
        };
        return cancelSet;
    }
};
function mix(a, b, t) {
    if (typeof a === "number") {
        return mixNumbers(a, b, t);
    }
    else if (a instanceof vec2) {
        return new vec2(mixNumbers(a.x, b.x, t), mixNumbers(a.y, b.y, t));
    }
    else if (a instanceof vec3) {
        return new vec3(mixNumbers(a.x, b.x, t), mixNumbers(a.y, b.y, t), mixNumbers(a.z, b.z, t));
    }
    else if (b instanceof vec4) {
        return new vec4(mixNumbers(a.x, b.x, t), mixNumbers(a.y, b.y, t), mixNumbers(a.z, b.z, t), mixNumbers(a.w, b.w, t));
    }
    else if (b instanceof quat) {
        return quat.slerp(a, b, t);
    }
    throw new Error(`Illegal arguments`);
}
function mixNumbers(a, b, t) {
    const range = b - a;
    return a + range * t;
}
/**
 * Copy of the TweenManager bezier implementation: https://docs.snap.com/lens-studio/references/guides/lens-features/adding-interactivity/helper-scripts/tween-manager
 * @param x1 the x coordinate of the first point in the bezier curve
 * @param y1 the y coordinate of the first point in the bezier curve
 * @param x2 the x coordinate of the second point in the bezier curve
 * @param y2 the y coordinate of the second point in the bezier curve
 * @returns interpolated number
 */
function createCubicBezierEasingFunction(x1, y1, x2, y2) {
    const p0 = new vec2(0, 0);
    const p1 = new vec2(x1, y1);
    const p2 = new vec2(x2, y2);
    const p3 = new vec2(1, 1);
    return (t) => {
        const oneMinusT = 1 - t;
        return p0
            .uniformScale(oneMinusT * oneMinusT * oneMinusT)
            .add(p1.uniformScale(3.0 * oneMinusT * oneMinusT * t))
            .add(p2.uniformScale(3.0 * oneMinusT * t * t))
            .add(p3.uniformScale(t * t * t)).y;
    };
}
let AnimationManager = (() => {
    let _classDecorators = [Singleton_1.Singleton];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AnimationManager = _classThis = class {
        constructor() {
            this.animationCallbacks = [];
            this.countCallbacks = [];
            this.sceneObject = global.scene.createSceneObject("animate-EventDispatcher");
            this.script = this.sceneObject.createComponent("ScriptComponent");
            this.requestAnimationFrame = (callback) => {
                this.animationCallbacks.push(callback);
            };
            this.requestAnimationFrame.trackCounts = (callback) => {
                this.countCallbacks.push(callback);
            };
            this.script.createEvent("UpdateEvent").bind(() => {
                const callbacks = this.animationCallbacks;
                // report the number of callbacks to the countCallbacks
                if (callbacks.length) {
                    for (const callback of this.countCallbacks) {
                        callback(callbacks.length);
                    }
                }
                // Animation Frames often reques the next frame
                this.animationCallbacks = [];
                for (const callback of callbacks) {
                    callback();
                }
            });
        }
    };
    __setFunctionName(_classThis, "AnimationManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnimationManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnimationManager = _classThis;
})();
exports.AnimationManager = AnimationManager;
//# sourceMappingURL=animate.js.map
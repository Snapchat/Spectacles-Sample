"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Easing = void 0;
/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */
exports.Easing = Object.freeze({
    Linear: Object.freeze({
        None(amount) {
            return amount;
        },
        In(amount) {
            return amount;
        },
        Out(amount) {
            return amount;
        },
        InOut(amount) {
            return amount;
        },
    }),
    Quadratic: Object.freeze({
        In(amount) {
            return amount * amount;
        },
        Out(amount) {
            return amount * (2 - amount);
        },
        InOut(amount) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount;
            }
            return -0.5 * (--amount * (amount - 2) - 1);
        },
    }),
    Cubic: Object.freeze({
        In(amount) {
            return amount * amount * amount;
        },
        Out(amount) {
            return --amount * amount * amount + 1;
        },
        InOut(amount) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount * amount;
            }
            return 0.5 * ((amount -= 2) * amount * amount + 2);
        },
    }),
    Quartic: Object.freeze({
        In(amount) {
            return amount * amount * amount * amount;
        },
        Out(amount) {
            return 1 - --amount * amount * amount * amount;
        },
        InOut(amount) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount * amount * amount;
            }
            return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
        },
    }),
    Quintic: Object.freeze({
        In(amount) {
            return amount * amount * amount * amount * amount;
        },
        Out(amount) {
            return --amount * amount * amount * amount * amount + 1;
        },
        InOut(amount) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount * amount * amount * amount;
            }
            return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
        },
    }),
    Sinusoidal: Object.freeze({
        In(amount) {
            return 1 - Math.sin(((1.0 - amount) * Math.PI) / 2);
        },
        Out(amount) {
            return Math.sin((amount * Math.PI) / 2);
        },
        InOut(amount) {
            return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)));
        },
    }),
    Exponential: Object.freeze({
        In(amount) {
            return amount === 0 ? 0 : Math.pow(1024, amount - 1);
        },
        Out(amount) {
            return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
        },
        InOut(amount) {
            if (amount === 0) {
                return 0;
            }
            if (amount === 1) {
                return 1;
            }
            if ((amount *= 2) < 1) {
                return 0.5 * Math.pow(1024, amount - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
        },
    }),
    Circular: Object.freeze({
        In(amount) {
            return 1 - Math.sqrt(1 - amount * amount);
        },
        Out(amount) {
            return Math.sqrt(1 - --amount * amount);
        },
        InOut(amount) {
            if ((amount *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
        },
    }),
    Elastic: Object.freeze({
        In(amount) {
            if (amount === 0) {
                return 0;
            }
            if (amount === 1) {
                return 1;
            }
            return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
        },
        Out(amount) {
            if (amount === 0) {
                return 0;
            }
            if (amount === 1) {
                return 1;
            }
            return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
        },
        InOut(amount) {
            if (amount === 0) {
                return 0;
            }
            if (amount === 1) {
                return 1;
            }
            amount *= 2;
            if (amount < 1) {
                return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
            }
            return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
        },
    }),
    Back: Object.freeze({
        In(amount) {
            const s = 1.70158;
            return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s);
        },
        Out(amount) {
            const s = 1.70158;
            return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1;
        },
        InOut(amount) {
            const s = 1.70158 * 1.525;
            if ((amount *= 2) < 1) {
                return 0.5 * (amount * amount * ((s + 1) * amount - s));
            }
            return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
        },
    }),
    Bounce: Object.freeze({
        In(amount) {
            return 1 - exports.Easing.Bounce.Out(1 - amount);
        },
        Out(amount) {
            if (amount < 1 / 2.75) {
                return 7.5625 * amount * amount;
            }
            else if (amount < 2 / 2.75) {
                return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
            }
            else if (amount < 2.5 / 2.75) {
                return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
            }
            else {
                return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
            }
        },
        InOut(amount) {
            if (amount < 0.5) {
                return exports.Easing.Bounce.In(amount * 2) * 0.5;
            }
            return exports.Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
        },
    }),
    generatePow(power = 4) {
        power = power < Number.EPSILON ? Number.EPSILON : power;
        power = power > 10000 ? 10000 : power;
        return {
            In(amount) {
                return amount ** power;
            },
            Out(amount) {
                return 1 - (1 - amount) ** power;
            },
            InOut(amount) {
                if (amount < 0.5) {
                    return (amount * 2) ** power / 2;
                }
                return (1 - (2 - amount * 2) ** power) / 2 + 0.5;
            },
        };
    },
});
exports.default = exports.Easing;
//# sourceMappingURL=Easing.js.map
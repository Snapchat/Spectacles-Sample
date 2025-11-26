"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Now_1 = require("./Now");
/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
class Group {
    constructor(...tweens) {
        this._tweens = {};
        this._tweensAddedDuringUpdate = {};
        this.add(...tweens);
    }
    getAll() {
        return Object.keys(this._tweens).map(tweenId => this._tweens[tweenId]);
    }
    removeAll() {
        this._tweens = {};
    }
    add(...tweens) {
        for (const tween of tweens) {
            // Remove from any other group first, a tween can only be in one group at a time.
            // @ts-expect-error library internal access
            tween._group?.remove(tween);
            // @ts-expect-error library internal access
            tween._group = this;
            this._tweens[tween.getId()] = tween;
            this._tweensAddedDuringUpdate[tween.getId()] = tween;
        }
    }
    remove(...tweens) {
        for (const tween of tweens) {
            // @ts-expect-error library internal access
            tween._group = undefined;
            delete this._tweens[tween.getId()];
            delete this._tweensAddedDuringUpdate[tween.getId()];
        }
    }
    /** Return true if all tweens in the group are not paused or playing. */
    allStopped() {
        return this.getAll().every(tween => !tween.isPlaying());
    }
    update(time = (0, Now_1.default)(), preserve = true) {
        let tweenIds = Object.keys(this._tweens);
        if (tweenIds.length === 0)
            return;
        // Tweens are updated in "batches". If you add a new tween during an
        // update, then the new tween will be updated in the next batch.
        // If you remove a tween during an update, it may or may not be updated.
        // However, if the removed tween was added during the current batch,
        // then it will not be updated.
        while (tweenIds.length > 0) {
            this._tweensAddedDuringUpdate = {};
            for (let i = 0; i < tweenIds.length; i++) {
                const tween = this._tweens[tweenIds[i]];
                const autoStart = !preserve;
                if (tween && tween.update(time, autoStart) === false && !preserve)
                    this.remove(tween);
            }
            tweenIds = Object.keys(this._tweensAddedDuringUpdate);
        }
    }
}
exports.default = Group;
//# sourceMappingURL=Group.js.map
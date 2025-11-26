"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utils
 */
class Sequence {
    static nextId() {
        return Sequence._nextId++;
    }
}
Sequence._nextId = 0;
exports.default = Sequence;
//# sourceMappingURL=Sequence.js.map
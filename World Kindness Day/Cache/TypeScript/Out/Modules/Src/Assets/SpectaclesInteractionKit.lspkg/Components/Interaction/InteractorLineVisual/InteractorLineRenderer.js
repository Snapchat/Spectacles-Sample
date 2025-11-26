"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualStyle = void 0;
const LineRenderer_1 = require("../../../Utils/views/LineRenderer/LineRenderer");
var VisualStyle;
(function (VisualStyle) {
    VisualStyle[VisualStyle["Full"] = 0] = "Full";
    VisualStyle[VisualStyle["Split"] = 1] = "Split";
    VisualStyle[VisualStyle["FadedEnd"] = 2] = "FadedEnd";
    VisualStyle[VisualStyle["FadedStart"] = 3] = "FadedStart";
})(VisualStyle || (exports.VisualStyle = VisualStyle = {}));
/**
 * InteractorLineRenderer is a modified LineRenderer meant for use with Interactors.
 * It uses a special shader material in order to display the line gradients and visuals shown in the spec.
 */
class InteractorLineRenderer extends LineRenderer_1.default {
    /**
     * @returns visual gradient style of the line
     */
    get visualStyle() {
        return this.material.mainPass.visualStyle;
    }
    /**
     * Set the visual gradient style of the line
     */
    set visualStyle(style) {
        this.material.mainPass.visualStyle = style;
    }
    /**
     * @returns maximum opacity level of the line
     */
    get opacity() {
        return this.material.mainPass.maxAlpha;
    }
    /**
     * Set the maximum opacity level of the line
     */
    set opacity(opacity) {
        this.material.mainPass.maxAlpha = opacity;
    }
}
exports.default = InteractorLineRenderer;
//# sourceMappingURL=InteractorLineRenderer.js.map
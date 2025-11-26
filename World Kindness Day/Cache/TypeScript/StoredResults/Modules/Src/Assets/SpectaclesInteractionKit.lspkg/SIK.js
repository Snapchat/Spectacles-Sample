"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIK = void 0;
const InteractionManager_1 = require("./Core/InteractionManager/InteractionManager");
const CursorControllerProvider_1 = require("./Providers/CursorControllerProvider/CursorControllerProvider");
const HandInputData_1 = require("./Providers/HandInputData/HandInputData");
const InteractionConfigurationProvider_1 = require("./Providers/InteractionConfigurationProvider/InteractionConfigurationProvider");
const SIKLogLevelProvider_1 = require("./Providers/InteractionConfigurationProvider/SIKLogLevelProvider");
const MobileInputData_1 = require("./Providers/MobileInputData/MobileInputData");
exports.SIK = {
    get SIKLogLevelProvider() {
        return SIKLogLevelProvider_1.default.getInstance();
    },
    get InteractionConfiguration() {
        return InteractionConfigurationProvider_1.InteractionConfigurationProvider.getInstance();
    },
    get HandInputData() {
        return HandInputData_1.HandInputData.getInstance();
    },
    get MobileInputData() {
        return MobileInputData_1.MobileInputData.getInstance();
    },
    get InteractionManager() {
        return InteractionManager_1.InteractionManager.getInstance();
    },
    get CursorController() {
        return CursorControllerProvider_1.CursorControllerProvider.getInstance();
    }
};
exports.default = exports.SIK;
//# sourceMappingURL=SIK.js.map
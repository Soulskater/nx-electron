"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const executor_1 = tslib_1.__importDefault(require("./executor"));
function executorAdapter(options, context) {
    return executor_1.default(options, context);
}
exports.default = devkit_1.convertNxExecutor(executorAdapter);
//# sourceMappingURL=executor.compat.js.map
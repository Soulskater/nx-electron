"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executor = void 0;
const path_1 = require("path");
const operators_1 = require("rxjs/operators");
const rxjs_for_await_1 = require("rxjs-for-await");
const run_webpack_1 = require("../../utils/run-webpack");
const project_graph_1 = require("@nrwl/workspace/src/core/project-graph");
const buildable_libs_utils_1 = require("@nrwl/workspace/src/utilities/buildable-libs-utils");
const electron_config_1 = require("../../utils/electron.config");
const normalize_1 = require("../../utils/normalize");
const workspace_1 = require("../../utils/workspace");
const config_1 = require("../../utils/config");
const generate_package_json_1 = require("../../utils/generate-package-json");
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
}
catch (e) { }
function executor(rawOptions, context) {
    var _a;
    const { sourceRoot, projectRoot } = workspace_1.getSourceRoot(context);
    const normalizedOptions = normalize_1.normalizeBuildOptions(rawOptions, context.root, sourceRoot, projectRoot);
    const projGraph = project_graph_1.readCachedProjectGraph();
    if (!normalizedOptions.buildLibsFromSource) {
        const { target, dependencies } = buildable_libs_utils_1.calculateProjectDependencies(projGraph, context.root, context.projectName, context.targetName, context.configurationName);
        normalizedOptions.tsConfig = buildable_libs_utils_1.createTmpTsConfig(normalizedOptions.tsConfig, context.root, target.data.root, dependencies);
        if (!buildable_libs_utils_1.checkDependentProjectsHaveBeenBuilt(context.root, context.projectName, context.targetName, dependencies)) {
            return { success: false };
        }
    }
    if (normalizedOptions.generatePackageJson) {
        generate_package_json_1.generatePackageJson(context.projectName, projGraph, normalizedOptions);
    }
    let config = electron_config_1.getElectronWebpackConfig(normalizedOptions);
    if (normalizedOptions.webpackConfig) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        config = require(normalizedOptions.webpackConfig)(config, {
            normalizedOptions,
            configuration: context.configurationName,
        });
    }
    config.entry['preload'] = path_1.join(normalizedOptions.sourceRoot, (_a = normalizedOptions.preload) !== null && _a !== void 0 ? _a : 'app/preload.ts');
    return rxjs_for_await_1.eachValueFrom(run_webpack_1.runWebpack(config).pipe(operators_1.tap((stats) => {
        console.info(stats.toString(config.stats));
    }), operators_1.map((stats) => {
        return {
            success: !stats.hasErrors(),
            outfile: path_1.resolve(context.root, normalizedOptions.outputPath, config_1.MAIN_OUTPUT_FILENAME)
        };
    })));
}
exports.executor = executor;
exports.default = executor;
//# sourceMappingURL=executor.js.map
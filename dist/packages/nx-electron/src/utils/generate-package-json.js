"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePackageJson = void 0;
const fileutils_1 = require("@nrwl/workspace/src/utilities/fileutils");
const config_1 = require("./config");
/**
 * Creates a package.json in the output directory for support  to install dependencies within containers.
 *
 * If a package.json exists in the project, it will reuse that.
 *
 * @param projectName
 * @param graph
 * @param options
 * @constructor
 */
function generatePackageJson(projectName, graph, options) {
    // default package.json if one does not exist
    let packageJson = {
        name: projectName,
        version: '0.0.1',
        main: config_1.INDEX_OUTPUT_FILENAME,
        dependencies: {}
    };
    try {
        // try loading local project package json
        packageJson = fileutils_1.readJsonFile(`${options.projectRoot}/package.json`);
        if (!packageJson.dependencies) {
            packageJson.dependencies = {};
        }
    }
    catch (e) {
    }
    const rootPackageJson = fileutils_1.readJsonFile(`${options.root}/package.json`);
    const npmDeps = findAllNpmDeps(projectName, graph);
    const implicitDeps = findAllNpmImplicitDeps(rootPackageJson, options.implicitDependencies);
    const dependencies = Object.assign({}, implicitDeps, npmDeps);
    // update dependencies
    Object.entries(dependencies).forEach(([packageName, version]) => {
        var _a;
        // don't include devDeps
        if ((_a = rootPackageJson.devDependencies) === null || _a === void 0 ? void 0 : _a[packageName]) {
            return;
        }
        packageJson.dependencies[packageName] = version;
    });
    fileutils_1.writeJsonFile(`${options.outputPath}/package.json`, packageJson);
}
exports.generatePackageJson = generatePackageJson;
function findAllNpmDeps(projectName, graph, list = {}, seen = new Set()) {
    var _a;
    if (seen.has(projectName)) {
        return list;
    }
    seen.add(projectName);
    const node = graph.nodes[projectName];
    if (node && node.type === 'npm') {
        list[node.data.packageName] = node.data.version;
    }
    (_a = graph.dependencies[projectName]) === null || _a === void 0 ? void 0 : _a.forEach((dep) => {
        findAllNpmDeps(dep.target, graph, list, seen);
    });
    return list;
}
function findAllNpmImplicitDeps(packageJson, implicitDeps) {
    const dependencies = implicitDeps.reduce((acc, dep) => {
        acc[dep] = packageJson.dependencies[dep];
        return acc;
    }, {});
    return dependencies;
}
//# sourceMappingURL=generate-package-json.js.map
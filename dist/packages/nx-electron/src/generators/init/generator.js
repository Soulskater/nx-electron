"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generator = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const versions_1 = require("../../utils/versions");
const set_default_collection_1 = require("@nrwl/workspace/src/utilities/set-default-collection");
const jest_1 = require("@nrwl/jest");
function addDependencies(tree) {
    return devkit_1.addDependenciesToPackageJson(tree, {}, {
        'nx-electron': versions_1.nxElectronVersion,
        'electron': versions_1.electronVersion,
        'exitzero': versions_1.exitZeroVersion,
        // 'electron-builder': electronBuilderVersion,
    });
}
function moveDependency(tree) {
    return devkit_1.updateJson(tree, 'package.json', json => {
        json.dependencies = json.dependencies || {};
        delete json.dependencies['nx-electron'];
        delete json.dependencies['electron'];
        // delete json.dependencies['electron-builder'];
        return json;
    });
}
function addScripts(tree) {
    return devkit_1.updateJson(tree, 'package.json', json => {
        json.scripts = json.scripts || {};
        const postinstall = json.scripts["postinstall"];
        json.scripts["postinstall"] = (postinstall && postinstall !== '') ?
            `${postinstall} && exitzero electron-builder install-app-deps` :
            "exitzero electron-builder install-app-deps";
        return json;
    });
}
function normalizeOptions(schema) {
    var _a;
    return Object.assign(Object.assign({}, schema), { unitTestRunner: (_a = schema.unitTestRunner) !== null && _a !== void 0 ? _a : 'jest' });
}
function generator(tree, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = normalizeOptions(schema);
        set_default_collection_1.setDefaultCollection(tree, 'nx-electron');
        let jestInstall;
        if (options.unitTestRunner === 'jest') {
            jestInstall = yield jest_1.jestInitGenerator(tree, {});
        }
        const installTask = yield addDependencies(tree);
        if (!options.skipFormat) {
            yield devkit_1.formatFiles(tree);
        }
        return () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (jestInstall) {
                yield jestInstall();
            }
            yield addScripts(tree);
            yield installTask();
            yield moveDependency(tree);
        });
    });
}
exports.generator = generator;
exports.default = generator;
//# sourceMappingURL=generator.js.map
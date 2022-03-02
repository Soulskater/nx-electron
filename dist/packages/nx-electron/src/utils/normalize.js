"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePackagingOptions = exports.normalizeBuildOptions = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
function normalizeBuildOptions(options, root, sourceRoot, projectRoot) {
    var _a, _b;
    return Object.assign(Object.assign({}, options), { root,
        sourceRoot,
        projectRoot, main: path_1.resolve(root, options.main), outputPath: path_1.resolve(root, options.outputPath), tsConfig: path_1.resolve(root, options.tsConfig), fileReplacements: normalizeFileReplacements(root, options.fileReplacements), assets: normalizeAssets(options.assets, root, sourceRoot), webpackConfig: options.webpackConfig ? path_1.resolve(root, options.webpackConfig) : options.webpackConfig, additionalEntryPoints: normalizeAdditionalEntries(root, (_a = options.additionalEntryPoints) !== null && _a !== void 0 ? _a : []), outputFileName: (_b = options.outputFileName) !== null && _b !== void 0 ? _b : 'main.js', alias: options.alias });
}
exports.normalizeBuildOptions = normalizeBuildOptions;
function normalizePackagingOptions(options, root, sourceRoot) {
    return Object.assign(Object.assign({}, options), { root,
        sourceRoot });
}
exports.normalizePackagingOptions = normalizePackagingOptions;
function normalizeAssets(assets, root, sourceRoot) {
    if (!Array.isArray(assets)) {
        return [];
    }
    return assets.map((asset) => {
        if (typeof asset === 'string') {
            const resolvedAssetPath = path_1.resolve(root, asset);
            const resolvedSourceRoot = path_1.resolve(root, sourceRoot);
            if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
                throw new Error(`The ${resolvedAssetPath} asset path must start with the project source root: ${sourceRoot}`);
            }
            const isDirectory = fs_1.statSync(resolvedAssetPath).isDirectory();
            const input = isDirectory
                ? resolvedAssetPath
                : path_1.dirname(resolvedAssetPath);
            const output = path_1.relative(resolvedSourceRoot, path_1.resolve(root, input));
            const glob = isDirectory ? '**/*' : path_1.basename(resolvedAssetPath);
            return {
                input,
                output,
                glob
            };
        }
        else {
            if (asset.output.startsWith('..')) {
                throw new Error('An asset cannot be written to a location outside of the output path.');
            }
            const resolvedAssetPath = path_1.resolve(root, asset.input);
            return Object.assign(Object.assign({}, asset), { input: resolvedAssetPath, 
                // Now we remove starting slash to make Webpack place it from the output root.
                output: asset.output.replace(/^\//, '') });
        }
    });
}
function normalizeFileReplacements(root, fileReplacements) {
    return fileReplacements.map((fileReplacement) => ({
        replace: path_1.resolve(root, fileReplacement.replace),
        with: path_1.resolve(root, fileReplacement.with)
    }));
}
function normalizePluginPath(path, root) {
    try {
        return require.resolve(path);
    }
    catch (_a) {
        return path_1.resolve(root, path);
    }
}
function normalizeAdditionalEntries(root, additionalEntries) {
    return additionalEntries.map(({ entryName, entryPath }) => ({
        entryName,
        entryPath: path_1.resolve(root, entryPath)
    }));
}
//# sourceMappingURL=normalize.js.map
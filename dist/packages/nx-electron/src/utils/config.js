"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseWebpackPartial = exports.OUT_FILENAME_TEMPLATE = exports.DEFAULT_APPS_DIR = exports.INDEX_OUTPUT_FILENAME = exports.MAIN_OUTPUT_FILENAME = void 0;
const tslib_1 = require("tslib");
const webpack_1 = require("webpack");
const ts = tslib_1.__importStar(require("typescript"));
const path_1 = tslib_1.__importStar(require("path"));
const license_webpack_plugin_1 = require("license-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const tsconfig_paths_webpack_plugin_1 = tslib_1.__importDefault(require("tsconfig-paths-webpack-plugin"));
const copy_webpack_plugin_1 = tslib_1.__importDefault(require("copy-webpack-plugin"));
const typescript_1 = require("@nrwl/workspace/src/utilities/typescript");
const webpack_node_externals_1 = tslib_1.__importDefault(require("webpack-node-externals"));
exports.MAIN_OUTPUT_FILENAME = 'main.js';
exports.INDEX_OUTPUT_FILENAME = 'index.js';
exports.DEFAULT_APPS_DIR = 'apps';
exports.OUT_FILENAME_TEMPLATE = '[name].js';
function getBaseWebpackPartial(options) {
    var _a, _b;
    const { options: compilerOptions } = typescript_1.readTsConfig(options.tsConfig);
    const supportsEs2015 = compilerOptions.target !== ts.ScriptTarget.ES3 &&
        compilerOptions.target !== ts.ScriptTarget.ES5;
    const mainFields = [...(supportsEs2015 ? ['es2015'] : []), 'module', 'main'];
    const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];
    const additionalEntryPoints = (_b = (_a = options.additionalEntryPoints) === null || _a === void 0 ? void 0 : _a.reduce((obj, current) => (Object.assign(Object.assign({}, obj), { [current.entryName]: current.entryPath })), {})) !== null && _b !== void 0 ? _b : {};
    const webpackConfig = {
        entry: Object.assign({ main: [options.main] }, additionalEntryPoints),
        devtool: options.sourceMap ? 'source-map' : false,
        mode: options.optimization ? 'production' : 'development',
        output: {
            path: options.outputPath,
            filename: (pathData) => {
                return pathData.chunk.name === 'main' ? options.outputFileName : exports.OUT_FILENAME_TEMPLATE;
            },
            hashFunction: 'xxhash64',
            // Disabled for performance
            pathinfo: false
        },
        module: {
            // Enabled for performance
            // unsafeCache: true,
            rules: [
                {
                    test: /\.([jt])sx?$/,
                    loader: require.resolve(`ts-loader`),
                    exclude: /node_modules/,
                    options: {
                        configFile: options.tsConfig,
                        transpileOnly: true,
                        // https://github.com/TypeStrong/ts-loader/pull/685
                        experimentalWatchApi: true
                    }
                }
            ]
        },
        externalsPresets: { node: true },
        externals: [webpack_node_externals_1.default()],
        node: {
            __dirname: false
        },
        resolve: {
            extensions,
            alias: getAliases(options),
            plugins: [
                new tsconfig_paths_webpack_plugin_1.default({
                    configFile: options.tsConfig,
                    extensions,
                    mainFields
                })
            ],
            mainFields
        },
        performance: {
            hints: false
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    configFile: options.tsConfig,
                    memoryLimit: options.memoryLimit || 2018
                }
            }),
            new webpack_1.DefinePlugin({
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                __BUILD_VERSION__: JSON.stringify(require(path_1.join(options.root, 'package.json')).version),
                __BUILD_DATE__: Date.now()
            })
        ],
        watch: options.watch,
        watchOptions: {
            poll: options.poll
        },
        stats: options.verbose ? 'verbose' : 'normal'
    };
    const extraPlugins = [];
    if (options.progress) {
        extraPlugins.push(new webpack_1.ProgressPlugin());
    }
    if (options.extractLicenses) {
        extraPlugins.push(new license_webpack_plugin_1.LicenseWebpackPlugin({
            stats: {
                warnings: false,
                errors: false
            },
            perChunkOutput: false,
            outputFilename: `3rdpartylicenses.txt`
        }));
    }
    // process asset entries
    if (Array.isArray(options.assets) && options.assets.length > 0) {
        const copyWebpackPluginInstance = new copy_webpack_plugin_1.default({
            patterns: options.assets.map((asset) => {
                var _a;
                return {
                    context: asset.input,
                    // Now we remove starting slash to make Webpack place it from the output root.
                    to: asset.output,
                    from: asset.glob,
                    globOptions: {
                        ignore: [
                            '.gitkeep',
                            '**/.DS_Store',
                            '**/Thumbs.db',
                            ...((_a = asset.ignore) !== null && _a !== void 0 ? _a : [])
                        ],
                        dot: true
                    }
                };
            })
        });
        new copy_webpack_plugin_1.default({
            patterns: options.assets.map((asset) => {
                var _a;
                return {
                    context: asset.input,
                    // Now we remove starting slash to make Webpack place it from the output root.
                    to: asset.output,
                    from: asset.glob,
                    globOptions: {
                        ignore: [
                            '.gitkeep',
                            '**/.DS_Store',
                            '**/Thumbs.db',
                            ...((_a = asset.ignore) !== null && _a !== void 0 ? _a : [])
                        ],
                        dot: true
                    }
                };
            })
        });
        extraPlugins.push(copyWebpackPluginInstance);
    }
    webpackConfig.plugins = [...webpackConfig.plugins, ...extraPlugins];
    return webpackConfig;
}
exports.getBaseWebpackPartial = getBaseWebpackPartial;
function getAliases(options) {
    const replacements = options.fileReplacements.reduce((aliases, replacement) => (Object.assign(Object.assign({}, aliases), { [replacement.replace]: replacement.with })), {});
    return Object.keys(options.alias).reduce((aliases, key) => (Object.assign(Object.assign({}, aliases), { [key]: path_1.default.resolve(options.root, options.alias[key]) })), replacements);
}
//# sourceMappingURL=config.js.map
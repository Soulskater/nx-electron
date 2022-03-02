import { Configuration } from 'webpack';
import { BuildBuilderOptions } from './types';
export declare const MAIN_OUTPUT_FILENAME = "main.js";
export declare const INDEX_OUTPUT_FILENAME = "index.js";
export declare const DEFAULT_APPS_DIR = "apps";
export declare const OUT_FILENAME_TEMPLATE = "[name].js";
export declare function getBaseWebpackPartial(options: BuildBuilderOptions): Configuration;

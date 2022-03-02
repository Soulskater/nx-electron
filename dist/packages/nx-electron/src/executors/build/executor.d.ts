import { ExecutorContext } from '@nrwl/devkit';
import { BuildBuilderOptions } from '../../utils/types';
export declare type ElectronBuildEvent = {
    outfile: string;
    success: boolean;
};
export interface BuildElectronBuilderOptions extends BuildBuilderOptions {
    optimization?: boolean;
    sourceMap?: boolean;
    buildLibsFromSource?: boolean;
    generatePackageJson?: boolean;
    implicitDependencies: Array<string>;
    externalDependencies: 'all' | 'none' | Array<string>;
}
export interface NormalizedBuildElectronBuilderOptions extends BuildElectronBuilderOptions {
    webpackConfig: string;
}
export declare function executor(rawOptions: BuildElectronBuilderOptions, context: ExecutorContext): AsyncIterableIterator<ElectronBuildEvent>;
export default executor;

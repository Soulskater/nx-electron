import { BuildElectronBuilderOptions, NormalizedBuildElectronBuilderOptions } from '../executors/build/executor';
import { PackageElectronBuilderOptions } from '../executors/package/executor';
export interface FileReplacement {
    replace: string;
    with: string;
}
export declare function normalizeBuildOptions(options: BuildElectronBuilderOptions, root: string, sourceRoot: string, projectRoot: string): NormalizedBuildElectronBuilderOptions;
export declare function normalizePackagingOptions<T extends PackageElectronBuilderOptions>(options: T, root: string, sourceRoot: string): T;

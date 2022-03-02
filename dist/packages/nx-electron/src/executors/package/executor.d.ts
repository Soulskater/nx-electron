import { ExecutorContext } from '@nrwl/devkit';
import { Configuration, PublishOptions } from 'electron-builder';
export interface PackageElectronBuilderOptions extends Configuration {
    name: string;
    frontendProject: string;
    platform: string | string[];
    arch: string;
    root: string;
    prepackageOnly: boolean;
    sourcePath: string;
    outputPath: string;
    publishPolicy?: PublishOptions['publish'];
}
export interface PackageElectronBuilderOutput {
    target?: any;
    success: boolean;
    outputPath: string | string[];
}
export declare function executor(rawOptions: PackageElectronBuilderOptions, context: ExecutorContext): Promise<{
    success: boolean;
}>;
export default executor;

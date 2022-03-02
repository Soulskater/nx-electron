import { ExecutorContext } from '@nrwl/devkit';
import { ElectronBuildEvent } from '../build/executor';
export declare const enum InspectType {
    Inspect = "inspect",
    InspectBrk = "inspect-brk",
    InspectBrkNode = "inspect-brk-node",
    InspectBrkElectron = "inspect-brk-electron"
}
export interface ElectronExecuteBuilderOptions {
    inspect: boolean | InspectType;
    port: number;
    args: string[];
    waitUntilTargets: string[];
    buildTargetOptions: Record<string, any>;
    buildTarget: string;
    watch: boolean;
}
export declare function executor(options: ElectronExecuteBuilderOptions, context: ExecutorContext): AsyncGenerator<ElectronBuildEvent, void, unknown>;
export default executor;

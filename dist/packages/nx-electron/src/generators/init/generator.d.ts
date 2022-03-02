import { Tree } from '@nrwl/devkit';
import { Schema } from './schema';
export declare function generator(tree: Tree, schema: Schema): Promise<() => Promise<void>>;
export default generator;

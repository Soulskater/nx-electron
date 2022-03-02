"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceRoot = void 0;
function getSourceRoot(context) {
    const { sourceRoot, root } = context.workspace.projects[context.projectName];
    if (sourceRoot && root) {
        return { sourceRoot, projectRoot: root };
    }
    throw new Error('Project does not have a sourceRoot or root. Please define both.');
}
exports.getSourceRoot = getSourceRoot;
//# sourceMappingURL=workspace.js.map
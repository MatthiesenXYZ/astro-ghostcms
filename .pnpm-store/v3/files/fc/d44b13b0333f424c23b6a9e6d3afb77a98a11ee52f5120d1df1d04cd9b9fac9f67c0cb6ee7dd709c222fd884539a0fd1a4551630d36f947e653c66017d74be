"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVirtualFileAndMap = exports.notEmpty = void 0;
function notEmpty(value) {
    return value !== null && value !== undefined;
}
exports.notEmpty = notEmpty;
function getVirtualFileAndMap(files, fileName) {
    const sourceFile = files.get(fileName);
    if (sourceFile?.generated) {
        const script = sourceFile.generated.languagePlugin.typescript?.getScript(sourceFile.generated.code);
        if (script) {
            for (const map of files.getMaps(script.code)) {
                if (map[1][0] === sourceFile.snapshot) {
                    return [script, sourceFile, map[1][1]];
                }
            }
        }
    }
    return [undefined, undefined, undefined];
}
exports.getVirtualFileAndMap = getVirtualFileAndMap;
//# sourceMappingURL=utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResolveModuleName = void 0;
function createResolveModuleName(ts, languageServiceHost, languagePlugins, getFile) {
    const toPatchResults = new Map();
    const moduleResolutionHost = {
        readFile: languageServiceHost.readFile.bind(languageServiceHost),
        directoryExists: languageServiceHost.directoryExists?.bind(languageServiceHost),
        realpath: languageServiceHost.realpath?.bind(languageServiceHost),
        getCurrentDirectory: languageServiceHost.getCurrentDirectory.bind(languageServiceHost),
        getDirectories: languageServiceHost.getDirectories?.bind(languageServiceHost),
        useCaseSensitiveFileNames: languageServiceHost.useCaseSensitiveFileNames?.bind(languageServiceHost),
        fileExists(fileName) {
            for (const { typescript } of languagePlugins) {
                if (!typescript) {
                    continue;
                }
                for (const { extension } of typescript.extraFileExtensions) {
                    if (fileName.endsWith(`.d.${extension}.ts`)) {
                        const patchFileName = fileName.slice(0, -`.d.${extension}.ts`.length) + `.${extension}`;
                        if (fileExists(patchFileName)) {
                            toPatchResults.set(fileName, patchFileName);
                            return true;
                        }
                    }
                }
            }
            return languageServiceHost.fileExists(fileName);
        },
    };
    return (moduleName, containingFile, compilerOptions, cache, redirectedReference, resolutionMode) => {
        const result = ts.resolveModuleName(moduleName, containingFile, compilerOptions, moduleResolutionHost, cache, redirectedReference, resolutionMode);
        if (result.resolvedModule && toPatchResults.has(result.resolvedModule.resolvedFileName)) {
            result.resolvedModule.resolvedFileName = toPatchResults.get(result.resolvedModule.resolvedFileName);
            const sourceFile = getFile(result.resolvedModule.resolvedFileName);
            if (sourceFile?.generated) {
                const tsCode = sourceFile.generated.languagePlugin.typescript?.getScript(sourceFile.generated.code);
                if (tsCode) {
                    result.resolvedModule.extension = tsCode.extension;
                }
            }
        }
        toPatchResults.clear();
        return result;
    };
    // fix https://github.com/vuejs/language-tools/issues/3332
    function fileExists(fileName) {
        if (languageServiceHost.fileExists(fileName)) {
            const fileSize = ts.sys.getFileSize?.(fileName) ?? languageServiceHost.readFile(fileName)?.length ?? 0;
            return fileSize < 4 * 1024 * 1024;
        }
        return false;
    }
}
exports.createResolveModuleName = createResolveModuleName;
//# sourceMappingURL=resolveModuleName.js.map
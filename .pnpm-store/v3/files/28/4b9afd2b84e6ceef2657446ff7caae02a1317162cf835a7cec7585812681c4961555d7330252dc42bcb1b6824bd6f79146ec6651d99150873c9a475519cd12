"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachEmbeddedCode = exports.updateVirtualCodeMaps = exports.createFileRegistry = void 0;
const source_map_1 = require("@volar/source-map");
const linkedCodeMap_1 = require("./linkedCodeMap");
const utils_1 = require("./utils");
function createFileRegistry(languagePlugins, caseSensitive, sync) {
    const sourceFiles = new utils_1.FileMap(caseSensitive);
    const virtualCodeToSourceFileMap = new WeakMap();
    const virtualCodeToMaps = new WeakMap();
    const virtualCodeToLinkedCodeMap = new WeakMap();
    return {
        languagePlugins,
        set(id, languageId, snapshot) {
            const value = sourceFiles.get(id);
            if (value) {
                if (value.languageId !== languageId) {
                    // languageId changed
                    this.delete(id);
                    return this.set(id, languageId, snapshot);
                }
                else if (value.snapshot !== snapshot) {
                    // snapshot updated
                    value.snapshot = snapshot;
                    if (value.generated) {
                        value.generated.code = value.generated.languagePlugin.updateVirtualCode(id, value.generated.code, snapshot, this);
                        for (const code of forEachEmbeddedCode(value.generated.code)) {
                            virtualCodeToSourceFileMap.set(code, value);
                        }
                    }
                    return value;
                }
                else {
                    // not changed
                    return value;
                }
            }
            // created
            const sourceFile = { id, languageId, snapshot };
            sourceFiles.set(id, sourceFile);
            for (const languagePlugin of languagePlugins) {
                const virtualCode = languagePlugin.createVirtualCode(id, languageId, snapshot, this);
                if (virtualCode) {
                    sourceFile.generated = {
                        code: virtualCode,
                        languagePlugin,
                    };
                    for (const code of forEachEmbeddedCode(virtualCode)) {
                        virtualCodeToSourceFileMap.set(code, sourceFile);
                    }
                    break;
                }
            }
            return sourceFile;
        },
        delete(id) {
            const value = sourceFiles.get(id);
            if (value) {
                if (value.generated) {
                    value.generated.languagePlugin.disposeVirtualCode?.(id, value.generated.code, this);
                }
                sourceFiles.delete(id);
            }
        },
        get(id) {
            sync(id);
            return sourceFiles.get(id);
        },
        getByVirtualCode(virtualCode) {
            return virtualCodeToSourceFileMap.get(virtualCode);
        },
        getLinkedCodeMap(virtualCode) {
            if (!virtualCodeToLinkedCodeMap.has(virtualCode.snapshot)) {
                virtualCodeToLinkedCodeMap.set(virtualCode.snapshot, virtualCode.linkedCodeMappings
                    ? new linkedCodeMap_1.LinkedCodeMap(virtualCode.linkedCodeMappings)
                    : undefined);
            }
            return virtualCodeToLinkedCodeMap.get(virtualCode.snapshot);
        },
        getMaps(virtualCode) {
            if (!virtualCodeToMaps.has(virtualCode.snapshot)) {
                virtualCodeToMaps.set(virtualCode.snapshot, new Map());
            }
            updateVirtualCodeMaps(virtualCode, sourceFileId => {
                if (sourceFileId) {
                    const sourceFile = sourceFiles.get(sourceFileId);
                    return [sourceFileId, sourceFile.snapshot];
                }
                else {
                    const sourceFile = virtualCodeToSourceFileMap.get(virtualCode);
                    return [sourceFile.id, sourceFile.snapshot];
                }
            }, virtualCodeToMaps.get(virtualCode.snapshot));
            return virtualCodeToMaps.get(virtualCode.snapshot);
        },
        getVirtualCode(sourceFileId, virtualCodeId) {
            const sourceFile = this.get(sourceFileId);
            if (sourceFile?.generated) {
                for (const code of forEachEmbeddedCode(sourceFile.generated.code)) {
                    if (code.id === virtualCodeId) {
                        return [code, sourceFile];
                    }
                }
            }
            return [undefined, undefined];
        },
    };
}
exports.createFileRegistry = createFileRegistry;
function updateVirtualCodeMaps(virtualCode, getSourceSnapshot, map = new Map()) {
    const sources = new Set();
    for (const mapping of virtualCode.mappings) {
        if (sources.has(mapping.source)) {
            continue;
        }
        sources.add(mapping.source);
        const source = getSourceSnapshot(mapping.source);
        if (!source) {
            continue;
        }
        if (!map.has(source[0]) || map.get(source[0])[0] !== source[1]) {
            map.set(source[0], [source[1], new source_map_1.SourceMap(virtualCode.mappings.filter(mapping2 => mapping2.source === mapping.source))]);
        }
    }
    return map;
}
exports.updateVirtualCodeMaps = updateVirtualCodeMaps;
function* forEachEmbeddedCode(code) {
    yield code;
    for (const embeddedCode of code.embeddedCodes) {
        yield* forEachEmbeddedCode(embeddedCode);
    }
}
exports.forEachEmbeddedCode = forEachEmbeddedCode;
//# sourceMappingURL=fileRegistry.js.map
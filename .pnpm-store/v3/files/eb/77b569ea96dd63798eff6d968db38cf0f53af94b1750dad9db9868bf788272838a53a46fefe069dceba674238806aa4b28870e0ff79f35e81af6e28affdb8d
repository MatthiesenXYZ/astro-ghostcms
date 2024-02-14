"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSpan = exports.transformDocumentSpan = exports.transformFileTextChanges = exports.transformDiagnostic = exports.transformCallHierarchyItem = void 0;
const language_core_1 = require("@volar/language-core");
const utils_1 = require("./utils");
const transformedDiagnostics = new WeakMap();
function transformCallHierarchyItem(files, item, filter) {
    const span = transformSpan(files, item.file, item.span, filter);
    const selectionSpan = transformSpan(files, item.file, item.selectionSpan, filter);
    return {
        ...item,
        span: span?.textSpan ?? { start: 0, length: 0 },
        selectionSpan: selectionSpan?.textSpan ?? { start: 0, length: 0 },
    };
}
exports.transformCallHierarchyItem = transformCallHierarchyItem;
function transformDiagnostic(files, diagnostic) {
    if (!transformedDiagnostics.has(diagnostic)) {
        transformedDiagnostics.set(diagnostic, undefined);
        const { relatedInformation } = diagnostic;
        if (relatedInformation) {
            diagnostic.relatedInformation = relatedInformation
                .map(d => transformDiagnostic(files, d))
                .filter(utils_1.notEmpty);
        }
        if (diagnostic.file !== undefined
            && diagnostic.start !== undefined
            && diagnostic.length !== undefined) {
            const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, diagnostic.file.fileName);
            if (virtualCode) {
                const sourceRange = transformRange(sourceFile, map, diagnostic.start, diagnostic.start + diagnostic.length, language_core_1.shouldReportDiagnostics);
                if (sourceRange) {
                    transformedDiagnostics.set(diagnostic, {
                        ...diagnostic,
                        start: sourceRange[0],
                        length: sourceRange[1] - sourceRange[0],
                    });
                }
            }
            else {
                transformedDiagnostics.set(diagnostic, diagnostic);
            }
        }
        else {
            transformedDiagnostics.set(diagnostic, diagnostic);
        }
    }
    return transformedDiagnostics.get(diagnostic);
}
exports.transformDiagnostic = transformDiagnostic;
function transformFileTextChanges(files, changes, filter) {
    const [_, source] = (0, utils_1.getVirtualFileAndMap)(files, changes.fileName);
    if (source) {
        return {
            ...changes,
            textChanges: changes.textChanges.map(c => {
                const span = transformSpan(files, changes.fileName, c.span, filter);
                if (span) {
                    return {
                        ...c,
                        span: span.textSpan,
                    };
                }
            }).filter(utils_1.notEmpty),
        };
    }
    else {
        return changes;
    }
}
exports.transformFileTextChanges = transformFileTextChanges;
function transformDocumentSpan(files, documentSpan, filter, shouldFallback) {
    let textSpan = transformSpan(files, documentSpan.fileName, documentSpan.textSpan, filter);
    if (!textSpan && shouldFallback) {
        const [virtualCode] = (0, utils_1.getVirtualFileAndMap)(files, documentSpan.fileName);
        if (virtualCode) {
            textSpan = {
                fileName: documentSpan.fileName,
                textSpan: { start: 0, length: 0 },
            };
        }
    }
    if (!textSpan) {
        return;
    }
    const contextSpan = transformSpan(files, documentSpan.fileName, documentSpan.contextSpan, filter);
    const originalTextSpan = transformSpan(files, documentSpan.originalFileName, documentSpan.originalTextSpan, filter);
    const originalContextSpan = transformSpan(files, documentSpan.originalFileName, documentSpan.originalContextSpan, filter);
    return {
        ...documentSpan,
        fileName: textSpan.fileName,
        textSpan: textSpan.textSpan,
        contextSpan: contextSpan?.textSpan,
        originalFileName: originalTextSpan?.fileName,
        originalTextSpan: originalTextSpan?.textSpan,
        originalContextSpan: originalContextSpan?.textSpan,
    };
}
exports.transformDocumentSpan = transformDocumentSpan;
function transformSpan(files, fileName, textSpan, filter) {
    if (!fileName) {
        return;
    }
    if (!textSpan) {
        return;
    }
    const [virtualFile, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
    if (virtualFile) {
        const sourceRange = transformRange(sourceFile, map, textSpan.start, textSpan.start + textSpan.length, filter);
        if (sourceRange) {
            return {
                fileName,
                textSpan: {
                    start: sourceRange[0],
                    length: sourceRange[1] - sourceRange[0],
                },
            };
        }
    }
    else {
        return {
            fileName,
            textSpan,
        };
    }
}
exports.transformSpan = transformSpan;
function transformRange(sourceFile, map, start, end, filter) {
    for (const sourceStart of map.getSourceOffsets(start - sourceFile.snapshot.getLength())) {
        if (filter(sourceStart[1].data)) {
            for (const sourceEnd of map.getSourceOffsets(end - sourceFile.snapshot.getLength())) {
                if (sourceEnd[0] >= sourceStart[0] && filter(sourceEnd[1].data)) {
                    return [sourceStart[0], sourceEnd[0]];
                }
            }
        }
    }
}
//# sourceMappingURL=transform.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateLanguageService = void 0;
const language_core_1 = require("@volar/language-core");
const dedupe_1 = require("./dedupe");
const utils_1 = require("./utils");
const transform_1 = require("./transform");
function decorateLanguageService(files, languageService) {
    // ignored methods
    const { getNavigationTree, getOutliningSpans, } = languageService;
    languageService.getNavigationTree = fileName => {
        const [virtualCode] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            const tree = getNavigationTree(fileName);
            tree.childItems = undefined;
            return tree;
        }
        else {
            return getNavigationTree(fileName);
        }
    };
    languageService.getOutliningSpans = fileName => {
        const [virtualCode] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            return [];
        }
        else {
            return getOutliningSpans(fileName);
        }
    };
    // methods
    const { findReferences, findRenameLocations, getCompletionEntryDetails, getCompletionsAtPosition, getDefinitionAndBoundSpan, getDefinitionAtPosition, getFileReferences, getImplementationAtPosition, getQuickInfoAtPosition, getReferencesAtPosition, getSemanticDiagnostics, getSyntacticDiagnostics, getSuggestionDiagnostics, getTypeDefinitionAtPosition, getEncodedSemanticClassifications, getDocumentHighlights, getApplicableRefactors, getEditsForRefactor, getRenameInfo, getCodeFixesAtPosition, prepareCallHierarchy, provideCallHierarchyIncomingCalls, provideCallHierarchyOutgoingCalls, provideInlayHints, organizeImports, } = languageService;
    languageService.prepareCallHierarchy = (fileName, position) => {
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if ((0, language_core_1.isCallHierarchyEnabled)(mapping.data)) {
                    const item = prepareCallHierarchy(fileName, generateOffset + sourceFile.snapshot.getLength());
                    if (Array.isArray(item)) {
                        return item.map(item => (0, transform_1.transformCallHierarchyItem)(files, item, language_core_1.isCallHierarchyEnabled));
                    }
                    else if (item) {
                        return (0, transform_1.transformCallHierarchyItem)(files, item, language_core_1.isCallHierarchyEnabled);
                    }
                }
            }
        }
        else {
            return prepareCallHierarchy(fileName, position);
        }
    };
    languageService.provideCallHierarchyIncomingCalls = (fileName, position) => {
        let calls = [];
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if ((0, language_core_1.isCallHierarchyEnabled)(mapping.data)) {
                    calls = provideCallHierarchyIncomingCalls(fileName, generateOffset + sourceFile.snapshot.getLength());
                }
            }
        }
        else {
            calls = provideCallHierarchyIncomingCalls(fileName, position);
        }
        return calls
            .map(call => {
            const from = (0, transform_1.transformCallHierarchyItem)(files, call.from, language_core_1.isCallHierarchyEnabled);
            const fromSpans = call.fromSpans
                .map(span => (0, transform_1.transformSpan)(files, call.from.file, span, language_core_1.isCallHierarchyEnabled)?.textSpan)
                .filter(utils_1.notEmpty);
            return {
                from,
                fromSpans,
            };
        });
    };
    languageService.provideCallHierarchyOutgoingCalls = (fileName, position) => {
        let calls = [];
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if ((0, language_core_1.isCallHierarchyEnabled)(mapping.data)) {
                    calls = provideCallHierarchyOutgoingCalls(fileName, generateOffset + sourceFile.snapshot.getLength());
                }
            }
        }
        else {
            calls = provideCallHierarchyOutgoingCalls(fileName, position);
        }
        return calls
            .map(call => {
            const to = (0, transform_1.transformCallHierarchyItem)(files, call.to, language_core_1.isCallHierarchyEnabled);
            const fromSpans = call.fromSpans
                .map(span => (0, transform_1.transformSpan)(files, fileName, span, language_core_1.isCallHierarchyEnabled)?.textSpan)
                .filter(utils_1.notEmpty);
            return {
                to,
                fromSpans,
            };
        });
    };
    languageService.organizeImports = (args, formatOptions, preferences) => {
        const unresolved = organizeImports(args, formatOptions, preferences);
        const resolved = unresolved
            .map(changes => (0, transform_1.transformFileTextChanges)(files, changes, language_core_1.isCodeActionsEnabled))
            .filter(utils_1.notEmpty);
        return resolved;
    };
    languageService.getQuickInfoAtPosition = (fileName, position) => {
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if ((0, language_core_1.isHoverEnabled)(mapping.data)) {
                    const result = getQuickInfoAtPosition(fileName, generateOffset + sourceFile.snapshot.getLength());
                    if (result) {
                        const textSpan = (0, transform_1.transformSpan)(files, fileName, result.textSpan, language_core_1.isHoverEnabled)?.textSpan;
                        if (textSpan) {
                            return {
                                ...result,
                                textSpan,
                            };
                        }
                    }
                }
            }
        }
        else {
            return getQuickInfoAtPosition(fileName, position);
        }
    };
    languageService.getDocumentHighlights = (fileName, position, filesToSearch) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isHighlightEnabled, position => getDocumentHighlights(fileName, position, filesToSearch), function* (result) {
            for (const ref of result) {
                for (const reference of ref.highlightSpans) {
                    yield [reference.fileName ?? ref.fileName, reference.textSpan.start];
                }
            }
        });
        const resolved = unresolved
            .flat()
            .map(highlights => {
            return {
                ...highlights,
                highlightSpans: highlights.highlightSpans
                    .map(span => {
                    const textSpan = (0, transform_1.transformSpan)(files, span.fileName ?? highlights.fileName, span.textSpan, language_core_1.isHighlightEnabled)?.textSpan;
                    if (textSpan) {
                        return {
                            ...span,
                            contextSpan: (0, transform_1.transformSpan)(files, span.fileName ?? highlights.fileName, span.contextSpan, language_core_1.isHighlightEnabled)?.textSpan,
                            textSpan,
                        };
                    }
                })
                    .filter(utils_1.notEmpty),
            };
        });
        return resolved;
    };
    languageService.getApplicableRefactors = (fileName, positionOrRange, preferences, triggerReason, kind, includeInteractiveActions) => {
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(typeof positionOrRange === 'number' ? positionOrRange : positionOrRange.pos)) {
                if ((0, language_core_1.isCodeActionsEnabled)(mapping.data)) {
                    const por = typeof positionOrRange === 'number'
                        ? generateOffset + sourceFile.snapshot.getLength()
                        : {
                            pos: generateOffset + sourceFile.snapshot.getLength(),
                            end: generateOffset + positionOrRange.end - positionOrRange.pos + sourceFile.snapshot.getLength(),
                        };
                    return getApplicableRefactors(fileName, por, preferences, triggerReason, kind, includeInteractiveActions);
                }
            }
            return [];
        }
        else {
            return getApplicableRefactors(fileName, positionOrRange, preferences, triggerReason, kind, includeInteractiveActions);
        }
    };
    languageService.getEditsForRefactor = (fileName, formatOptions, positionOrRange, refactorName, actionName, preferences) => {
        let edits;
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(typeof positionOrRange === 'number' ? positionOrRange : positionOrRange.pos)) {
                if ((0, language_core_1.isCodeActionsEnabled)(mapping.data)) {
                    const por = typeof positionOrRange === 'number'
                        ? generateOffset + sourceFile.snapshot.getLength()
                        : {
                            pos: generateOffset + sourceFile.snapshot.getLength(),
                            end: generateOffset + positionOrRange.end - positionOrRange.pos + sourceFile.snapshot.getLength(),
                        };
                    edits = getEditsForRefactor(fileName, formatOptions, por, refactorName, actionName, preferences);
                }
            }
        }
        else {
            edits = getEditsForRefactor(fileName, formatOptions, positionOrRange, refactorName, actionName, preferences);
        }
        if (edits) {
            edits.edits = edits.edits
                .map(edit => (0, transform_1.transformFileTextChanges)(files, edit, language_core_1.isCodeActionsEnabled))
                .filter(utils_1.notEmpty);
            return edits;
        }
    };
    languageService.getRenameInfo = (fileName, position, options) => {
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if ((0, language_core_1.isRenameEnabled)(mapping.data)) {
                    const info = getRenameInfo(fileName, generateOffset + sourceFile.snapshot.getLength(), options);
                    if (info.canRename) {
                        const span = (0, transform_1.transformSpan)(files, fileName, info.triggerSpan, language_core_1.isRenameEnabled);
                        if (span) {
                            info.triggerSpan = span.textSpan;
                            return info;
                        }
                    }
                    else {
                        return info;
                    }
                }
            }
            return {
                canRename: false,
                localizedErrorMessage: 'Failed to get rename locations',
            };
        }
        else {
            return getRenameInfo(fileName, position, options);
        }
    };
    languageService.getCodeFixesAtPosition = (fileName, start, end, errorCodes, formatOptions, preferences) => {
        let fixes = [];
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateStart, mapping] of map.getGeneratedOffsets(start)) {
                if ((0, language_core_1.isCodeActionsEnabled)(mapping.data)) {
                    for (const [generateEnd, mapping] of map.getGeneratedOffsets(end)) {
                        if ((0, language_core_1.isCodeActionsEnabled)(mapping.data)) {
                            fixes = getCodeFixesAtPosition(fileName, generateStart + sourceFile.snapshot.getLength(), generateEnd + sourceFile.snapshot.getLength(), errorCodes, formatOptions, preferences);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        else {
            fixes = getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions, preferences);
        }
        fixes = fixes.map(fix => {
            fix.changes = fix.changes.map(edit => (0, transform_1.transformFileTextChanges)(files, edit, language_core_1.isCodeActionsEnabled)).filter(utils_1.notEmpty);
            return fix;
        });
        return fixes;
    };
    languageService.getEncodedSemanticClassifications = (fileName, span, format) => {
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            let start;
            let end;
            for (const mapping of map.mappings) {
                if ((0, language_core_1.isSemanticTokensEnabled)(mapping.data) && mapping.sourceOffsets[0] >= span.start && mapping.sourceOffsets[0] <= span.start + span.length) {
                    start ??= mapping.generatedOffsets[0];
                    end ??= mapping.generatedOffsets[mapping.generatedOffsets.length - 1];
                    start = Math.min(start, mapping.generatedOffsets[0]);
                    end = Math.max(end, mapping.generatedOffsets[mapping.generatedOffsets.length - 1]);
                }
            }
            if (start === undefined || end === undefined) {
                start = 0;
                end = 0;
            }
            start += sourceFile.snapshot.getLength();
            end += sourceFile.snapshot.getLength();
            const result = getEncodedSemanticClassifications(fileName, { start, length: end - start }, format);
            const spans = [];
            for (let i = 0; i < result.spans.length; i += 3) {
                for (const [sourceStart, mapping] of map.getSourceOffsets(result.spans[i] - sourceFile.snapshot.getLength())) {
                    if ((0, language_core_1.isSemanticTokensEnabled)(mapping.data)) {
                        for (const [sourceEnd, mapping] of map.getSourceOffsets(result.spans[i] + result.spans[i + 1] - sourceFile.snapshot.getLength())) {
                            if ((0, language_core_1.isSemanticTokensEnabled)(mapping.data)) {
                                spans.push(sourceStart, sourceEnd - sourceStart, result.spans[i + 2]);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            result.spans = spans;
            return result;
        }
        else {
            return getEncodedSemanticClassifications(fileName, span, format);
        }
    };
    languageService.getSyntacticDiagnostics = fileName => {
        return getSyntacticDiagnostics(fileName)
            .map(d => (0, transform_1.transformDiagnostic)(files, d))
            .filter(utils_1.notEmpty);
    };
    languageService.getSemanticDiagnostics = fileName => {
        return getSemanticDiagnostics(fileName)
            .map(d => (0, transform_1.transformDiagnostic)(files, d))
            .filter(utils_1.notEmpty);
    };
    languageService.getSuggestionDiagnostics = fileName => {
        return getSuggestionDiagnostics(fileName)
            .map(d => (0, transform_1.transformDiagnostic)(files, d))
            .filter(utils_1.notEmpty);
    };
    languageService.getDefinitionAndBoundSpan = (fileName, position) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isDefinitionEnabled, position => getDefinitionAndBoundSpan(fileName, position), function* (result) {
            for (const ref of result.definitions ?? []) {
                yield [ref.fileName, ref.textSpan.start];
            }
        });
        const textSpan = unresolved
            .map(s => (0, transform_1.transformSpan)(files, fileName, s.textSpan, language_core_1.isDefinitionEnabled)?.textSpan)
            .filter(utils_1.notEmpty)[0];
        if (!textSpan) {
            return;
        }
        const definitions = unresolved
            .map(s => s.definitions
            ?.map(s => (0, transform_1.transformDocumentSpan)(files, s, language_core_1.isDefinitionEnabled, s.fileName !== fileName))
            .filter(utils_1.notEmpty))
            .filter(utils_1.notEmpty)
            .flat();
        return {
            textSpan,
            definitions: (0, dedupe_1.dedupeDocumentSpans)(definitions),
        };
    };
    languageService.findReferences = (fileName, position) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isReferencesEnabled, position => findReferences(fileName, position), function* (result) {
            for (const ref of result) {
                for (const reference of ref.references) {
                    yield [reference.fileName, reference.textSpan.start];
                }
            }
        });
        const resolved = unresolved
            .flat()
            .map(symbol => {
            const definition = (0, transform_1.transformDocumentSpan)(files, symbol.definition, language_core_1.isDefinitionEnabled);
            if (definition) {
                return {
                    definition,
                    references: symbol.references
                        .map(r => (0, transform_1.transformDocumentSpan)(files, r, language_core_1.isReferencesEnabled))
                        .filter(utils_1.notEmpty),
                };
            }
        })
            .filter(utils_1.notEmpty);
        return (0, dedupe_1.dedupeReferencedSymbols)(resolved);
    };
    languageService.getDefinitionAtPosition = (fileName, position) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isDefinitionEnabled, position => getDefinitionAtPosition(fileName, position), function* (result) {
            for (const ref of result) {
                yield [ref.fileName, ref.textSpan.start];
            }
        });
        const resolved = unresolved
            .flat()
            .map(s => (0, transform_1.transformDocumentSpan)(files, s, language_core_1.isDefinitionEnabled, s.fileName !== fileName))
            .filter(utils_1.notEmpty);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
    };
    languageService.getTypeDefinitionAtPosition = (fileName, position) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isTypeDefinitionEnabled, position => getTypeDefinitionAtPosition(fileName, position), function* (result) {
            for (const ref of result) {
                yield [ref.fileName, ref.textSpan.start];
            }
        });
        const resolved = unresolved
            .flat()
            .map(s => (0, transform_1.transformDocumentSpan)(files, s, language_core_1.isTypeDefinitionEnabled))
            .filter(utils_1.notEmpty);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
    };
    languageService.getImplementationAtPosition = (fileName, position) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isImplementationEnabled, position => getImplementationAtPosition(fileName, position), function* (result) {
            for (const ref of result) {
                yield [ref.fileName, ref.textSpan.start];
            }
        });
        const resolved = unresolved
            .flat()
            .map(s => (0, transform_1.transformDocumentSpan)(files, s, language_core_1.isImplementationEnabled))
            .filter(utils_1.notEmpty);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
    };
    languageService.findRenameLocations = (fileName, position, findInStrings, findInComments, preferences) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isRenameEnabled, position => findRenameLocations(fileName, position, findInStrings, findInComments, preferences), function* (result) {
            for (const ref of result) {
                yield [ref.fileName, ref.textSpan.start];
            }
        });
        const resolved = unresolved
            .flat()
            .map(s => (0, transform_1.transformDocumentSpan)(files, s, language_core_1.isRenameEnabled))
            .filter(utils_1.notEmpty);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
    };
    languageService.getReferencesAtPosition = (fileName, position) => {
        const unresolved = linkedCodeFeatureWorker(fileName, position, language_core_1.isReferencesEnabled, position => getReferencesAtPosition(fileName, position), function* (result) {
            for (const ref of result) {
                yield [ref.fileName, ref.textSpan.start];
            }
        });
        const resolved = unresolved
            .flat()
            .map(s => (0, transform_1.transformDocumentSpan)(files, s, language_core_1.isReferencesEnabled))
            .filter(utils_1.notEmpty);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
    };
    languageService.getCompletionsAtPosition = (fileName, position, options, formattingSettings) => {
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            let mainResult;
            let additionalResults = [];
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if ((0, language_core_1.isCompletionEnabled)(mapping.data)) {
                    const isAdditional = typeof mapping.data.completion === 'object' && mapping.data.completion.isAdditional;
                    if (!isAdditional && mainResult) {
                        continue;
                    }
                    const result = getCompletionsAtPosition(fileName, generateOffset + sourceFile.snapshot.getLength(), options, formattingSettings);
                    if (result) {
                        for (const entry of result.entries) {
                            entry.replacementSpan = (0, transform_1.transformSpan)(files, fileName, entry.replacementSpan, language_core_1.isCompletionEnabled)?.textSpan;
                        }
                        result.optionalReplacementSpan = (0, transform_1.transformSpan)(files, fileName, result.optionalReplacementSpan, language_core_1.isCompletionEnabled)?.textSpan;
                        if (isAdditional) {
                            additionalResults.push(result);
                        }
                        else {
                            mainResult = result;
                        }
                    }
                }
            }
            if (!mainResult && additionalResults.length) {
                mainResult = additionalResults.shift();
            }
            if (mainResult) {
                return {
                    ...mainResult,
                    entries: [
                        ...mainResult.entries,
                        ...additionalResults.map(additionalResult => additionalResult.entries).flat(),
                    ],
                };
            }
        }
        else {
            return getCompletionsAtPosition(fileName, position, options, formattingSettings);
        }
    };
    languageService.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data) => {
        let details;
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if ((0, language_core_1.isCompletionEnabled)(mapping.data)) {
                    details = getCompletionEntryDetails(fileName, generateOffset + sourceFile.snapshot.getLength(), entryName, formatOptions, source, preferences, data);
                    break;
                }
            }
        }
        else {
            return getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
        }
        if (details?.codeActions) {
            for (const codeAction of details.codeActions) {
                codeAction.changes = codeAction.changes.map(edit => (0, transform_1.transformFileTextChanges)(files, edit, language_core_1.isCompletionEnabled)).filter(utils_1.notEmpty);
            }
        }
        return details;
    };
    languageService.provideInlayHints = (fileName, span, preferences) => {
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            let start;
            let end;
            for (const mapping of map.mappings) {
                if ((0, language_core_1.isInlayHintsEnabled)(mapping.data) && mapping.sourceOffsets[0] >= span.start && mapping.sourceOffsets[0] <= span.start + span.length) {
                    start ??= mapping.generatedOffsets[0];
                    end ??= mapping.generatedOffsets[mapping.generatedOffsets.length - 1];
                    start = Math.min(start, mapping.generatedOffsets[0]);
                    end = Math.max(end, mapping.generatedOffsets[mapping.generatedOffsets.length - 1]);
                }
            }
            if (start === undefined || end === undefined) {
                start = 0;
                end = 0;
            }
            start += sourceFile.snapshot.getLength();
            end += sourceFile.snapshot.getLength();
            const result = provideInlayHints(fileName, { start, length: end - start }, preferences);
            const hints = [];
            for (const hint of result) {
                for (const [sourcePosition, mapping] of map.getSourceOffsets(hint.position - sourceFile.snapshot.getLength())) {
                    if ((0, language_core_1.isInlayHintsEnabled)(mapping.data)) {
                        hints.push({
                            ...hint,
                            position: sourcePosition,
                        });
                        break;
                    }
                }
            }
            return hints;
        }
        else {
            return provideInlayHints(fileName, span, preferences);
        }
    };
    languageService.getFileReferences = fileName => {
        const unresolved = getFileReferences(fileName);
        const resolved = unresolved
            .map(s => (0, transform_1.transformDocumentSpan)(files, s, language_core_1.isReferencesEnabled))
            .filter(utils_1.notEmpty);
        return (0, dedupe_1.dedupeDocumentSpans)(resolved);
    };
    function linkedCodeFeatureWorker(fileName, position, filter, worker, getLinkedCodes) {
        let results = [];
        const processedFilePositions = new Set();
        const [virtualCode, sourceFile, map] = (0, utils_1.getVirtualFileAndMap)(files, fileName);
        if (virtualCode) {
            for (const [generateOffset, mapping] of map.getGeneratedOffsets(position)) {
                if (filter(mapping.data)) {
                    process(fileName, generateOffset + sourceFile.snapshot.getLength());
                }
            }
        }
        else {
            process(fileName, position);
        }
        return results;
        function process(fileName, position) {
            if (processedFilePositions.has(fileName + ':' + position)) {
                return;
            }
            processedFilePositions.add(fileName + ':' + position);
            const result = worker(position);
            if (!result) {
                return;
            }
            results = results.concat(result);
            for (const ref of getLinkedCodes(result)) {
                processedFilePositions.add(ref[0] + ':' + ref[1]);
                const [virtualFile, sourceFile] = (0, utils_1.getVirtualFileAndMap)(files, ref[0]);
                if (!virtualFile) {
                    continue;
                }
                const linkedCodeMap = files.getLinkedCodeMap(virtualFile.code);
                if (!linkedCodeMap) {
                    continue;
                }
                for (const linkedCodeOffset of linkedCodeMap.getLinkedOffsets(ref[1] - sourceFile.snapshot.getLength())) {
                    process(ref[0], linkedCodeOffset + sourceFile.snapshot.getLength());
                }
            }
        }
    }
}
exports.decorateLanguageService = decorateLanguageService;
//# sourceMappingURL=decorateLanguageService.js.map
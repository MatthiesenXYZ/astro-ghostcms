"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const cancellation_1 = require("../utils/cancellation");
const common_1 = require("../utils/common");
const dedupe = require("../utils/dedupe");
const featureWorkers_1 = require("../utils/featureWorkers");
function register(context, apiName, isValidPosition) {
    return (uri, position, token = cancellation_1.NoneCancellationToken) => {
        return (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => position, map => map.getGeneratedPositions(position, isValidPosition), async (service, document, position) => {
            if (token.isCancellationRequested) {
                return;
            }
            const recursiveChecker = dedupe.createLocationSet();
            const result = [];
            await withMirrors(document, position, undefined);
            return result;
            async function withMirrors(document, position, originDefinition) {
                const api = service[1][apiName];
                if (!api) {
                    return;
                }
                if (recursiveChecker.has({ uri: document.uri, range: { start: position, end: position } })) {
                    return;
                }
                recursiveChecker.add({ uri: document.uri, range: { start: position, end: position } });
                const definitions = await api?.(document, position, token) ?? [];
                for (const definition of definitions) {
                    let foundMirrorPosition = false;
                    recursiveChecker.add({ uri: definition.targetUri, range: { start: definition.targetRange.start, end: definition.targetRange.start } });
                    const [virtualCode] = context.documents.getVirtualCodeByUri(definition.targetUri);
                    const mirrorMap = virtualCode ? context.documents.getLinkedCodeMap(virtualCode) : undefined;
                    if (mirrorMap) {
                        for (const linkedPos of mirrorMap.getLinkedCodePositions(definition.targetSelectionRange.start)) {
                            if (recursiveChecker.has({ uri: mirrorMap.document.uri, range: { start: linkedPos, end: linkedPos } })) {
                                continue;
                            }
                            foundMirrorPosition = true;
                            await withMirrors(mirrorMap.document, linkedPos, originDefinition ?? definition);
                        }
                    }
                    if (!foundMirrorPosition) {
                        if (originDefinition) {
                            result.push({
                                ...definition,
                                originSelectionRange: originDefinition.originSelectionRange,
                            });
                        }
                        else {
                            result.push(definition);
                        }
                    }
                }
            }
        }, (data, map) => data.map(link => {
            if (link.originSelectionRange && map) {
                const originSelectionRange = toSourcePositionPreferSurroundedPosition(map, link.originSelectionRange, position);
                if (!originSelectionRange) {
                    return;
                }
                link.originSelectionRange = originSelectionRange;
            }
            let foundTargetSelectionRange = false;
            const [targetVirtualFile] = context.documents.getVirtualCodeByUri(link.targetUri);
            if (targetVirtualFile) {
                for (const targetSourceMap of context.documents.getMaps(targetVirtualFile)) {
                    const targetSelectionRange = targetSourceMap.getSourceRange(link.targetSelectionRange);
                    if (!targetSelectionRange) {
                        continue;
                    }
                    foundTargetSelectionRange = true;
                    let targetRange = targetSourceMap.getSourceRange(link.targetRange);
                    link.targetUri = targetSourceMap.sourceFileDocument.uri;
                    // loose range mapping to for template slots, slot properties
                    link.targetRange = targetRange ?? targetSelectionRange;
                    link.targetSelectionRange = targetSelectionRange;
                }
                if (apiName === 'provideDefinition' && !foundTargetSelectionRange) {
                    for (const targetMap of context.documents.getMaps(targetVirtualFile)) {
                        if (targetMap && targetMap.sourceFileDocument.uri !== uri) {
                            return {
                                ...link,
                                targetUri: targetMap.sourceFileDocument.uri,
                                targetRange: {
                                    start: { line: 0, character: 0 },
                                    end: { line: 0, character: 0 },
                                },
                                targetSelectionRange: {
                                    start: { line: 0, character: 0 },
                                    end: { line: 0, character: 0 },
                                },
                            };
                        }
                    }
                    return;
                }
            }
            return link;
        }).filter(common_1.notEmpty), arr => dedupe.withLocationLinks(arr.flat()));
    };
}
exports.register = register;
function toSourcePositionPreferSurroundedPosition(map, mappedRange, position) {
    let result;
    for (const range of map.getSourceRanges(mappedRange)) {
        if (!result) {
            result = range;
        }
        if ((range.start.line < position.line || (range.start.line === position.line && range.start.character <= position.character))
            && (range.end.line > position.line || (range.end.line === position.line && range.end.character >= position.character))) {
            return range;
        }
    }
    return result;
}
//# sourceMappingURL=provideDefinition.js.map
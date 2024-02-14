"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const featureWorkers_1 = require("../utils/featureWorkers");
const dedupe = require("../utils/dedupe");
const cancellation_1 = require("../utils/cancellation");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return (uri, position, referenceContext, token = cancellation_1.NoneCancellationToken) => {
        return (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => position, map => map.getGeneratedPositions(position, language_core_1.isReferencesEnabled), async (service, document, position) => {
            if (token.isCancellationRequested) {
                return;
            }
            const recursiveChecker = dedupe.createLocationSet();
            const result = [];
            await withMirrors(document, position);
            return result;
            async function withMirrors(document, position) {
                if (!service[1].provideReferences) {
                    return;
                }
                if (recursiveChecker.has({ uri: document.uri, range: { start: position, end: position } })) {
                    return;
                }
                recursiveChecker.add({ uri: document.uri, range: { start: position, end: position } });
                const references = await service[1].provideReferences(document, position, referenceContext, token) ?? [];
                for (const reference of references) {
                    let foundMirrorPosition = false;
                    recursiveChecker.add({ uri: reference.uri, range: { start: reference.range.start, end: reference.range.start } });
                    const [virtualCode] = context.documents.getVirtualCodeByUri(reference.uri);
                    const mirrorMap = virtualCode ? context.documents.getLinkedCodeMap(virtualCode) : undefined;
                    if (mirrorMap) {
                        for (const linkedPos of mirrorMap.getLinkedCodePositions(reference.range.start)) {
                            if (recursiveChecker.has({ uri: mirrorMap.document.uri, range: { start: linkedPos, end: linkedPos } })) {
                                continue;
                            }
                            foundMirrorPosition = true;
                            await withMirrors(mirrorMap.document, linkedPos);
                        }
                    }
                    if (!foundMirrorPosition) {
                        result.push(reference);
                    }
                }
            }
        }, data => {
            const results = [];
            for (const reference of data) {
                const [virtualCode] = context.documents.getVirtualCodeByUri(reference.uri);
                if (virtualCode) {
                    for (const map of context.documents.getMaps(virtualCode)) {
                        const range = map.getSourceRange(reference.range, language_core_1.isReferencesEnabled);
                        if (range) {
                            results.push({
                                uri: map.sourceFileDocument.uri,
                                range,
                            });
                        }
                    }
                }
                else {
                    results.push(reference);
                }
            }
            return results;
        }, arr => dedupe.withLocations(arr.flat()));
    };
}
exports.register = register;
//# sourceMappingURL=provideReferences.js.map
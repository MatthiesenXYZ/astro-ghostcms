"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const featureWorkers_1 = require("../utils/featureWorkers");
const dedupe = require("../utils/dedupe");
const common_1 = require("../utils/common");
const cancellation_1 = require("../utils/cancellation");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return (uri, position, token = cancellation_1.NoneCancellationToken) => {
        return (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => position, map => map.getGeneratedPositions(position, language_core_1.isHighlightEnabled), async (service, document, position) => {
            if (token.isCancellationRequested) {
                return;
            }
            const recursiveChecker = dedupe.createLocationSet();
            const result = [];
            await withMirrors(document, position);
            return result;
            async function withMirrors(document, position) {
                if (!service[1].provideDocumentHighlights) {
                    return;
                }
                if (recursiveChecker.has({ uri: document.uri, range: { start: position, end: position } })) {
                    return;
                }
                recursiveChecker.add({ uri: document.uri, range: { start: position, end: position } });
                const references = await service[1].provideDocumentHighlights(document, position, token) ?? [];
                for (const reference of references) {
                    let foundMirrorPosition = false;
                    recursiveChecker.add({ uri: document.uri, range: { start: reference.range.start, end: reference.range.start } });
                    const [virtualCode] = context.documents.getVirtualCodeByUri(document.uri);
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
        }, (data, map) => data
            .map(highlight => {
            if (!map) {
                return highlight;
            }
            const range = map.getSourceRange(highlight.range, language_core_1.isHighlightEnabled);
            if (range) {
                return {
                    ...highlight,
                    range,
                };
            }
        })
            .filter(common_1.notEmpty), arr => arr.flat());
    };
}
exports.register = register;
//# sourceMappingURL=provideDocumentHighlights.js.map
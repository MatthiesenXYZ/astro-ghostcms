"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const common_1 = require("../utils/common");
const featureWorkers_1 = require("../utils/featureWorkers");
const cancellation_1 = require("../utils/cancellation");
const transform_1 = require("../utils/transform");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return async (uri, range, token = cancellation_1.NoneCancellationToken) => {
        const sourceFile = context.language.files.get(uri);
        if (!sourceFile) {
            return;
        }
        const document = context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
        const offsetRange = {
            start: document.offsetAt(range.start),
            end: document.offsetAt(range.end),
        };
        return (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => range, function* (map) {
            /**
             * copy from ./codeActions.ts
             */
            if (!map.map.mappings.some(mapping => (0, language_core_1.isInlayHintsEnabled)(mapping.data))) {
                return;
            }
            let minStart;
            let maxEnd;
            for (const mapping of map.map.mappings) {
                const overlapRange = (0, common_1.getOverlapRange)(offsetRange.start, offsetRange.end, mapping.sourceOffsets[0], mapping.sourceOffsets[mapping.sourceOffsets.length - 1]
                    + mapping.lengths[mapping.lengths.length - 1]);
                if (overlapRange) {
                    const start = map.map.getGeneratedOffset(overlapRange.start)?.[0];
                    const end = map.map.getGeneratedOffset(overlapRange.end)?.[0];
                    if (start !== undefined && end !== undefined) {
                        minStart = minStart === undefined ? start : Math.min(start, minStart);
                        maxEnd = maxEnd === undefined ? end : Math.max(end, maxEnd);
                    }
                }
            }
            if (minStart !== undefined && maxEnd !== undefined) {
                yield {
                    start: map.virtualFileDocument.positionAt(minStart),
                    end: map.virtualFileDocument.positionAt(maxEnd),
                };
            }
        }, async (service, document, arg) => {
            if (token.isCancellationRequested) {
                return;
            }
            const hints = await service[1].provideInlayHints?.(document, arg, token);
            hints?.forEach(link => {
                link.data = {
                    uri,
                    original: {
                        data: link.data,
                    },
                    serviceIndex: context.services.indexOf(service),
                };
            });
            return hints;
        }, (inlayHints, map) => {
            if (!map) {
                return inlayHints;
            }
            return inlayHints
                .map((_inlayHint) => {
                const position = map.getSourcePosition(_inlayHint.position, language_core_1.isInlayHintsEnabled);
                const edits = _inlayHint.textEdits
                    ?.map(textEdit => (0, transform_1.transformTextEdit)(textEdit, range => map.getSourceRange(range), map.virtualFileDocument))
                    .filter(common_1.notEmpty);
                if (position) {
                    return {
                        ..._inlayHint,
                        position,
                        textEdits: edits,
                    };
                }
            })
                .filter(common_1.notEmpty);
        }, arr => arr.flat());
    };
}
exports.register = register;
//# sourceMappingURL=provideInlayHints.js.map
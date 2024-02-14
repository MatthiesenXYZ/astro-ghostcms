"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const SemanticTokensBuilder_1 = require("../utils/SemanticTokensBuilder");
const cancellation_1 = require("../utils/cancellation");
const common_1 = require("../utils/common");
const featureWorkers_1 = require("../utils/featureWorkers");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return async (uri, range, legend, token = cancellation_1.NoneCancellationToken, _reportProgress) => {
        const sourceFile = context.language.files.get(uri);
        if (!sourceFile) {
            return;
        }
        const document = context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
        if (!range) {
            range = {
                start: { line: 0, character: 0 },
                end: { line: document.lineCount - 1, character: document.getText().length },
            };
        }
        const tokens = await (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => range, function* (map) {
            let result;
            const start = document.offsetAt(range.start);
            const end = document.offsetAt(range.end);
            for (const mapping of map.map.mappings) {
                if ((0, language_core_1.isSemanticTokensEnabled)(mapping.data)) {
                    for (let i = 0; i < mapping.sourceOffsets.length; i++) {
                        if (mapping.sourceOffsets[i] + mapping.lengths[i] > start
                            && mapping.sourceOffsets[i] < end) {
                            if (!result) {
                                result = {
                                    start: mapping.generatedOffsets[i],
                                    end: mapping.generatedOffsets[i] + mapping.lengths[i],
                                };
                            }
                            else {
                                result.start = Math.min(result.start, mapping.generatedOffsets[i]);
                                result.end = Math.max(result.end, mapping.generatedOffsets[i] + mapping.lengths[i]);
                            }
                        }
                    }
                }
            }
            if (result) {
                yield {
                    start: map.virtualFileDocument.positionAt(result.start),
                    end: map.virtualFileDocument.positionAt(result.end),
                };
            }
        }, (service, document, range) => {
            if (token?.isCancellationRequested) {
                return;
            }
            return service[1].provideDocumentSemanticTokens?.(document, range, legend, token);
        }, (tokens, map) => {
            if (!map) {
                return tokens;
            }
            return tokens
                .map(_token => {
                const range = map.getSourceRange({
                    start: { line: _token[0], character: _token[1] },
                    end: { line: _token[0], character: _token[1] + _token[2] },
                }, language_core_1.isSemanticTokensEnabled);
                if (range) {
                    return [range.start.line, range.start.character, range.end.character - range.start.character, _token[3], _token[4]];
                }
            })
                .filter(common_1.notEmpty);
        }, tokens => tokens.flat());
        if (tokens) {
            return buildTokens(tokens);
        }
    };
}
exports.register = register;
function buildTokens(tokens) {
    const builder = new SemanticTokensBuilder_1.SemanticTokensBuilder();
    const sortedTokens = tokens.sort((a, b) => a[0] - b[0] === 0 ? a[1] - b[1] : a[0] - b[0]);
    for (const token of sortedTokens) {
        builder.push(...token);
    }
    return builder.build();
}
//# sourceMappingURL=provideDocumentSemanticTokens.js.map
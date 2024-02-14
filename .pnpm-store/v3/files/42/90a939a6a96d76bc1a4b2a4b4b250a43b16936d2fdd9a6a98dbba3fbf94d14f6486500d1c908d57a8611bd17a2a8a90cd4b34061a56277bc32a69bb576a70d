"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const cancellation_1 = require("../utils/cancellation");
const common_1 = require("../utils/common");
const dedupe = require("../utils/dedupe");
const featureWorkers_1 = require("../utils/featureWorkers");
const transform_1 = require("../utils/transform");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return async (uri, range, codeActionContext, token = cancellation_1.NoneCancellationToken) => {
        const sourceFile = context.language.files.get(uri);
        if (!sourceFile) {
            return;
        }
        const document = context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
        const offsetRange = {
            start: document.offsetAt(range.start),
            end: document.offsetAt(range.end),
        };
        const transformedCodeActions = new WeakSet();
        return await (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => ({ range, codeActionContext }), function* (map) {
            if (map.map.mappings.some(mapping => (0, language_core_1.isCodeActionsEnabled)(mapping.data))) {
                const _codeActionContext = {
                    diagnostics: (0, transform_1.transformLocations)(codeActionContext.diagnostics, range => map.getGeneratedRange(range)),
                    only: codeActionContext.only,
                };
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
                        range: {
                            start: map.virtualFileDocument.positionAt(minStart),
                            end: map.virtualFileDocument.positionAt(maxEnd),
                        },
                        codeActionContext: _codeActionContext,
                    };
                }
            }
        }, async (service, document, { range, codeActionContext }) => {
            if (token.isCancellationRequested) {
                return;
            }
            const serviceIndex = context.services.indexOf(service);
            const diagnostics = codeActionContext.diagnostics.filter(diagnostic => {
                const data = diagnostic.data;
                if (data && data.version !== document.version) {
                    return false;
                }
                return data?.serviceIndex === serviceIndex;
            }).map(diagnostic => {
                const data = diagnostic.data;
                return {
                    ...diagnostic,
                    ...data.original,
                };
            });
            const codeActions = await service[1].provideCodeActions?.(document, range, {
                ...codeActionContext,
                diagnostics,
            }, token);
            codeActions?.forEach(codeAction => {
                codeAction.data = {
                    uri,
                    version: document.version,
                    original: {
                        data: codeAction.data,
                        edit: codeAction.edit,
                    },
                    serviceIndex: context.services.indexOf(service),
                };
            });
            if (codeActions && service[1].transformCodeAction) {
                for (let i = 0; i < codeActions.length; i++) {
                    const transformed = service[1].transformCodeAction(codeActions[i]);
                    if (transformed) {
                        codeActions[i] = transformed;
                        transformedCodeActions.add(transformed);
                    }
                }
            }
            return codeActions;
        }, actions => actions
            .map(action => {
            if (transformedCodeActions.has(action)) {
                return action;
            }
            if (action.edit) {
                const edit = (0, transform_1.transformWorkspaceEdit)(action.edit, context, 'codeAction');
                if (!edit) {
                    return;
                }
                action.edit = edit;
            }
            return action;
        })
            .filter(common_1.notEmpty), arr => dedupe.withCodeAction(arr.flat()));
    };
}
exports.register = register;
//# sourceMappingURL=provideCodeActions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const language_core_1 = require("@volar/language-core");
const cancellation_1 = require("../utils/cancellation");
const transform_1 = require("../utils/transform");
const featureWorkers_1 = require("../utils/featureWorkers");
function register(context) {
    let lastResult;
    return async (uri, position, completionContext = { triggerKind: 1, }, token = cancellation_1.NoneCancellationToken) => {
        const sourceFile = context.language.files.get(uri);
        if (!sourceFile) {
            return {
                isIncomplete: false,
                items: [],
            };
        }
        if (completionContext?.triggerKind === 3
            && lastResult?.uri === uri) {
            for (const cacheData of lastResult.results) {
                if (!cacheData.list?.isIncomplete) {
                    continue;
                }
                const serviceIndex = context.services.findIndex(service => service[1] === cacheData.service);
                if (cacheData.virtualDocumentUri) {
                    const [virtualCode] = context.documents.getVirtualCodeByUri(cacheData.virtualDocumentUri);
                    if (!virtualCode) {
                        continue;
                    }
                    for (const map of context.documents.getMaps(virtualCode)) {
                        for (const mapped of map.getGeneratedPositions(position, data => (0, language_core_1.isCompletionEnabled)(data))) {
                            if (!cacheData.service.provideCompletionItems) {
                                continue;
                            }
                            cacheData.list = await cacheData.service.provideCompletionItems(map.virtualFileDocument, mapped, completionContext, token);
                            if (!cacheData.list) {
                                continue;
                            }
                            for (const item of cacheData.list.items) {
                                item.data = {
                                    uri,
                                    original: {
                                        additionalTextEdits: item.additionalTextEdits,
                                        textEdit: item.textEdit,
                                        data: item.data,
                                    },
                                    serviceIndex,
                                    virtualDocumentUri: map.virtualFileDocument.uri,
                                };
                            }
                            cacheData.list = (0, transform_1.transformCompletionList)(cacheData.list, range => map.getSourceRange(range), map.virtualFileDocument, context);
                        }
                    }
                }
                else {
                    if (!cacheData.service.provideCompletionItems) {
                        continue;
                    }
                    const document = context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
                    cacheData.list = await cacheData.service.provideCompletionItems(document, position, completionContext, token);
                    if (!cacheData.list) {
                        continue;
                    }
                    for (const item of cacheData.list.items) {
                        item.data = {
                            uri,
                            original: {
                                additionalTextEdits: item.additionalTextEdits,
                                textEdit: item.textEdit,
                                data: item.data,
                            },
                            serviceIndex,
                            virtualDocumentUri: undefined,
                        };
                    }
                }
            }
        }
        else {
            lastResult = {
                uri,
                results: [],
            };
            // monky fix https://github.com/johnsoncodehk/volar/issues/1358
            let isFirstMapping = true;
            let mainCompletionUri;
            const services = [...context.services]
                .filter(service => !context.disabledServicePlugins.has(service[1]))
                .sort((a, b) => sortServices(a[1], b[1]));
            const worker = async (document, position, map, codeInfo) => {
                for (const service of services) {
                    if (token.isCancellationRequested) {
                        break;
                    }
                    if (!service[1].provideCompletionItems) {
                        continue;
                    }
                    if (service[1].isAdditionalCompletion && !isFirstMapping) {
                        continue;
                    }
                    if (completionContext?.triggerCharacter && !service[0].triggerCharacters?.includes(completionContext.triggerCharacter)) {
                        continue;
                    }
                    const isAdditional = (codeInfo && typeof codeInfo.completion === 'object' && codeInfo.completion.isAdditional) || service[1].isAdditionalCompletion;
                    if (mainCompletionUri && (!isAdditional || mainCompletionUri !== document.uri)) {
                        continue;
                    }
                    // avoid duplicate items with .vue and .vue.html
                    if (service[1].isAdditionalCompletion && lastResult?.results.some(data => data.service === service[1])) {
                        continue;
                    }
                    let completionList = await service[1].provideCompletionItems(document, position, completionContext, token);
                    if (!completionList || !completionList.items.length) {
                        continue;
                    }
                    if (typeof codeInfo?.completion === 'object' && codeInfo.completion.onlyImport) {
                        completionList.items = completionList.items.filter(item => !!item.labelDetails);
                    }
                    if (!isAdditional) {
                        mainCompletionUri = document.uri;
                    }
                    const serviceIndex = context.services.indexOf(service);
                    for (const item of completionList.items) {
                        item.data = {
                            uri,
                            original: {
                                additionalTextEdits: item.additionalTextEdits,
                                textEdit: item.textEdit,
                                data: item.data,
                            },
                            serviceIndex,
                            virtualDocumentUri: map ? document.uri : undefined,
                        };
                    }
                    if (map) {
                        completionList = (0, transform_1.transformCompletionList)(completionList, range => map.getSourceRange(range, language_core_1.isCompletionEnabled), document, context);
                    }
                    lastResult?.results.push({
                        virtualDocumentUri: map ? document.uri : undefined,
                        service: service[1],
                        list: completionList,
                    });
                }
                isFirstMapping = false;
            };
            if (sourceFile.generated) {
                for (const map of (0, featureWorkers_1.eachEmbeddedDocument)(context, sourceFile.generated.code)) {
                    let _data;
                    for (const mappedPosition of map.getGeneratedPositions(position, data => {
                        _data = data;
                        return (0, language_core_1.isCompletionEnabled)(data);
                    })) {
                        await worker(map.virtualFileDocument, mappedPosition, map, _data);
                    }
                }
            }
            else {
                const document = context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
                await worker(document, position);
            }
        }
        return combineCompletionList(lastResult.results.map(cacheData => cacheData.list));
        function sortServices(a, b) {
            return (b.isAdditionalCompletion ? -1 : 1) - (a.isAdditionalCompletion ? -1 : 1);
        }
        function combineCompletionList(lists) {
            return {
                isIncomplete: lists.some(list => list?.isIncomplete),
                itemDefaults: lists.find(list => list?.itemDefaults)?.itemDefaults,
                items: lists.map(list => list?.items ?? []).flat(),
            };
        }
    };
}
exports.register = register;
//# sourceMappingURL=provideCompletionItems.js.map
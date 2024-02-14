"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbeddedFilesByLevel = exports.eachEmbeddedDocument = exports.safeCall = exports.languageFeatureWorker = exports.documentFeatureWorker = void 0;
async function documentFeatureWorker(context, uri, valid, worker, transformResult, combineResult) {
    return languageFeatureWorker(context, uri, () => void 0, function* (map) {
        if (valid(map)) {
            yield;
        }
    }, worker, transformResult, combineResult);
}
exports.documentFeatureWorker = documentFeatureWorker;
async function languageFeatureWorker(context, uri, getReadDocParams, eachVirtualDocParams, worker, transformResult, combineResult) {
    const sourceFile = context.language.files.get(uri);
    if (!sourceFile) {
        return;
    }
    let results = [];
    if (sourceFile.generated) {
        for (const map of eachEmbeddedDocument(context, sourceFile.generated.code)) {
            for (const mappedArg of eachVirtualDocParams(map)) {
                for (const [serviceId, service] of Object.entries(context.services)) {
                    if (context.disabledServicePlugins.has(service[1])) {
                        continue;
                    }
                    const embeddedResult = await safeCall(() => worker(service, map.virtualFileDocument, mappedArg, map), 'service ' + serviceId + ' crashed on ' + map.virtualFileDocument.uri);
                    if (!embeddedResult) {
                        continue;
                    }
                    const result = transformResult(embeddedResult, map);
                    if (!result) {
                        continue;
                    }
                    results.push(result);
                    if (!combineResult) {
                        break;
                    }
                }
            }
        }
    }
    else {
        const document = context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
        const params = getReadDocParams();
        for (const [serviceId, service] of Object.entries(context.services)) {
            if (context.disabledServicePlugins.has(service[1])) {
                continue;
            }
            const embeddedResult = await safeCall(() => worker(service, document, params, undefined), 'service ' + serviceId + ' crashed on ' + uri);
            if (!embeddedResult) {
                continue;
            }
            const result = transformResult(embeddedResult, undefined);
            if (!result) {
                continue;
            }
            results.push(result);
            if (!combineResult) {
                break;
            }
        }
    }
    if (combineResult && results.length > 0) {
        return combineResult(results);
    }
    else if (results.length > 0) {
        return results[0];
    }
}
exports.languageFeatureWorker = languageFeatureWorker;
async function safeCall(cb, errorMsg) {
    try {
        return await cb();
    }
    catch (err) {
        console.warn(errorMsg, err);
    }
}
exports.safeCall = safeCall;
function* eachEmbeddedDocument(context, current, rootCode = current) {
    for (const embeddedCode of current.embeddedCodes) {
        yield* eachEmbeddedDocument(context, embeddedCode, rootCode);
    }
    for (const map of context.documents.getMaps(current)) {
        const sourceFile = context.language.files.get(map.sourceFileDocument.uri);
        if (sourceFile?.generated?.code === rootCode
            && !context.disabledVirtualFileUris.has(context.documents.getVirtualCodeUri(context.language.files.getByVirtualCode(current).id, current.id))) {
            yield map;
        }
    }
}
exports.eachEmbeddedDocument = eachEmbeddedDocument;
function getEmbeddedFilesByLevel(context, sourceFileUri, rootFile, level) {
    const embeddedFilesByLevel = [[rootFile]];
    while (true) {
        if (embeddedFilesByLevel.length > level) {
            return embeddedFilesByLevel[level];
        }
        let nextLevel = [];
        for (const file of embeddedFilesByLevel[embeddedFilesByLevel.length - 1]) {
            nextLevel = nextLevel.concat(file.embeddedCodes.filter(file => !context.disabledVirtualFileUris.has(context.documents.getVirtualCodeUri(sourceFileUri, file.id))));
        }
        embeddedFilesByLevel.push(nextLevel);
    }
}
exports.getEmbeddedFilesByLevel = getEmbeddedFilesByLevel;
//# sourceMappingURL=featureWorkers.js.map
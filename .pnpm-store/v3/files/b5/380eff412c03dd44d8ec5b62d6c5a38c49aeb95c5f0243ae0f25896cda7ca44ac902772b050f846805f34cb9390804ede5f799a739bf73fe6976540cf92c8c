"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const featureWorkers_1 = require("../utils/featureWorkers");
const dedupe = require("../utils/dedupe");
const common_1 = require("../utils/common");
const cancellation_1 = require("../utils/cancellation");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return (uri, token = cancellation_1.NoneCancellationToken) => {
        return (0, featureWorkers_1.documentFeatureWorker)(context, uri, () => true, async (service, document) => {
            if (token.isCancellationRequested) {
                return;
            }
            return await service[1].provideFileReferences?.(document, token) ?? [];
        }, data => data
            .map(reference => {
            const [virtualCode] = context.documents.getVirtualCodeByUri(reference.uri);
            if (!virtualCode) {
                return reference;
            }
            for (const map of context.documents.getMaps(virtualCode)) {
                const range = map.getSourceRange(reference.range, language_core_1.isReferencesEnabled);
                if (range) {
                    reference.uri = map.sourceFileDocument.uri;
                    reference.range = range;
                    return reference;
                }
            }
        })
            .filter(common_1.notEmpty), arr => dedupe.withLocations(arr.flat()));
    };
}
exports.register = register;
//# sourceMappingURL=provideFileReferences.js.map
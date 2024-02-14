"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const cancellation_1 = require("../utils/cancellation");
const common_1 = require("../utils/common");
const featureWorkers_1 = require("../utils/featureWorkers");
const transform_1 = require("../utils/transform");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return (uri, positions, token = cancellation_1.NoneCancellationToken) => {
        return (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => positions, function* (map) {
            const result = positions
                .map(position => map.getGeneratedPosition(position, language_core_1.isSelectionRangesEnabled))
                .filter(common_1.notEmpty);
            if (result.length) {
                yield result;
            }
        }, (service, document, positions) => {
            if (token.isCancellationRequested) {
                return;
            }
            return service[1].provideSelectionRanges?.(document, positions, token);
        }, (data, map) => {
            if (!map) {
                return data;
            }
            return (0, transform_1.transformSelectionRanges)(data, range => map.getSourceRange(range, language_core_1.isSelectionRangesEnabled));
        }, results => {
            const result = [];
            for (let i = 0; i < positions.length; i++) {
                let pluginResults = [];
                for (const ranges of results) {
                    pluginResults.push(ranges[i]);
                }
                pluginResults = pluginResults.sort((a, b) => {
                    if ((0, common_1.isInsideRange)(a.range, b.range)) {
                        return 1;
                    }
                    if ((0, common_1.isInsideRange)(b.range, a.range)) {
                        return -1;
                    }
                    return 0;
                });
                for (let i = 1; i < pluginResults.length; i++) {
                    let root = pluginResults[i - 1];
                    while (root.parent) {
                        root = root.parent;
                    }
                    let parent = pluginResults[i];
                    while (parent && !(0, common_1.isInsideRange)(parent.range, root.range)) {
                        parent = parent.parent;
                    }
                    if (parent) {
                        root.parent = parent;
                    }
                }
                result.push(pluginResults[0]);
            }
            return result;
        });
    };
}
exports.register = register;
//# sourceMappingURL=provideSelectionRanges.js.map
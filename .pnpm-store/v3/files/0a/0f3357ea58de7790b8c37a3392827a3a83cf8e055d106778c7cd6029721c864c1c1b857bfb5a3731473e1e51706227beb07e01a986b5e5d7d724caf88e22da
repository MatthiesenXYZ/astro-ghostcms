"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const featureWorkers_1 = require("../utils/featureWorkers");
const cancellation_1 = require("../utils/cancellation");
const language_core_1 = require("@volar/language-core");
function register(context) {
    return (uri, position, lastChange, token = cancellation_1.NoneCancellationToken) => {
        return (0, featureWorkers_1.languageFeatureWorker)(context, uri, () => ({ position, lastChange }), function* (map) {
            for (const mappedPosition of map.getGeneratedPositions(position, language_core_1.isAutoInsertEnabled)) {
                const range = map.getGeneratedRange(lastChange.range);
                if (range) {
                    yield {
                        position: mappedPosition,
                        lastChange: {
                            text: lastChange.text,
                            range,
                        },
                    };
                }
            }
        }, (service, document, args) => {
            if (token.isCancellationRequested) {
                return;
            }
            return service[1].provideAutoInsertionEdit?.(document, args.position, args.lastChange, token);
        }, (item, map) => {
            if (!map || typeof item === 'string') {
                return item;
            }
            const range = map.getSourceRange(item.range, language_core_1.isAutoInsertEnabled);
            if (range) {
                item.range = range;
                return item;
            }
        });
    };
}
exports.register = register;
//# sourceMappingURL=provideAutoInsertionEdit.js.map
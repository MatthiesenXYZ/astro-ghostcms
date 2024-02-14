"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const common_1 = require("../utils/common");
const cancellation_1 = require("../utils/cancellation");
const transform_1 = require("../utils/transform");
function register(context) {
    return async (query, token = cancellation_1.NoneCancellationToken) => {
        const symbolsList = [];
        for (const service of context.services) {
            if (context.disabledServicePlugins.has(service[1])) {
                continue;
            }
            if (token.isCancellationRequested) {
                break;
            }
            if (!service[1].provideWorkspaceSymbols) {
                continue;
            }
            const embeddedSymbols = await service[1].provideWorkspaceSymbols(query, token);
            if (!embeddedSymbols) {
                continue;
            }
            const symbols = embeddedSymbols.map(symbol => (0, transform_1.transformWorkspaceSymbol)(symbol, loc => {
                const [virtualCode] = context.documents.getVirtualCodeByUri(loc.uri);
                if (virtualCode) {
                    for (const map of context.documents.getMaps(virtualCode)) {
                        const range = map.getSourceRange(loc.range);
                        if (range) {
                            return { uri: map.sourceFileDocument.uri, range };
                        }
                    }
                }
                else {
                    return loc;
                }
            })).filter(common_1.notEmpty);
            symbolsList.push(symbols);
        }
        return symbolsList.flat();
    };
}
exports.register = register;
//# sourceMappingURL=provideWorkspaceSymbols.js.map
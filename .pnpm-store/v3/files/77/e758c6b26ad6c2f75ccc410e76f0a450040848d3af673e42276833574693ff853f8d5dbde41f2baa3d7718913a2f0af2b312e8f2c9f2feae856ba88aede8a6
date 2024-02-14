"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const shared_1 = require("../shared");
const transforms_1 = require("../utils/transforms");
function register(ctx) {
    return (uri, position, referenceContext) => {
        const document = ctx.getTextDocument(uri);
        if (!document)
            return [];
        const fileName = ctx.uriToFileName(document.uri);
        const offset = document.offsetAt(position);
        const references = (0, shared_1.safeCall)(() => ctx.languageService.findReferences(fileName, offset));
        if (!references)
            return [];
        const result = [];
        for (const reference of references) {
            if (referenceContext.includeDeclaration) {
                const definition = (0, transforms_1.entryToLocation)(reference.definition, ctx);
                if (definition) {
                    result.push(definition);
                }
            }
            for (const referenceEntry of reference.references) {
                const reference = (0, transforms_1.entryToLocation)(referenceEntry, ctx);
                if (reference) {
                    result.push(reference);
                }
            }
        }
        return result;
    };
}
exports.register = register;
//# sourceMappingURL=references.js.map
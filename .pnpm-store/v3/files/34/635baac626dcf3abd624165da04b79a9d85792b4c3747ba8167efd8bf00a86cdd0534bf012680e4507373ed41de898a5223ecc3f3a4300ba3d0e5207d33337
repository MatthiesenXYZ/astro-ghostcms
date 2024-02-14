"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_utils_1 = require("@eslint-community/eslint-utils");
const utils_1 = require("../utils");
const compat_1 = require("../utils/compat");
exports.default = (0, utils_1.createRule)("no-deprecated-astro-canonicalurl", {
    meta: {
        docs: {
            description: "disallow using deprecated `Astro.canonicalURL`",
            category: "Possible Errors",
            recommended: true,
        },
        schema: [],
        messages: {
            deprecated: "'Astro.canonicalURL' is deprecated. Use 'Astro.url' helper instead.",
        },
        type: "problem",
    },
    create(context) {
        const sourceCode = (0, compat_1.getSourceCode)(context);
        if (!sourceCode.parserServices.isAstro) {
            return {};
        }
        return {
            "Program:exit"(node) {
                const tracker = new eslint_utils_1.ReferenceTracker(sourceCode.getScope(node));
                for (const { node, path } of tracker.iterateGlobalReferences({
                    Astro: {
                        canonicalURL: { [eslint_utils_1.READ]: true },
                    },
                })) {
                    context.report({
                        node,
                        messageId: "deprecated",
                        data: { name: path.join(".") },
                    });
                }
            },
        };
    },
});

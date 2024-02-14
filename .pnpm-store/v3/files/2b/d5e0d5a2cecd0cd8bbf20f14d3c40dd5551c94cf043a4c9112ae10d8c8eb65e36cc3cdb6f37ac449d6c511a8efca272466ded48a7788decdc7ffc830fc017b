"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.default = (0, utils_1.createRule)("no-deprecated-getentrybyslug", {
    meta: {
        docs: {
            description: "disallow using deprecated `getEntryBySlug()`",
            category: "Possible Errors",
            recommended: true,
        },
        schema: [],
        messages: {
            deprecated: "'getEntryBySlug()' is deprecated. Use 'getEntry()' instead.",
        },
        type: "problem",
    },
    create(context) {
        if (!context.parserServices.isAstro) {
            return {};
        }
        return {
            ImportSpecifier(node) {
                var _a;
                if (node.imported.name === "getEntryBySlug" &&
                    ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.type) === "ImportDeclaration" &&
                    node.parent.source.value === "astro:content") {
                    context.report({
                        node,
                        messageId: "deprecated",
                    });
                }
            },
        };
    },
});

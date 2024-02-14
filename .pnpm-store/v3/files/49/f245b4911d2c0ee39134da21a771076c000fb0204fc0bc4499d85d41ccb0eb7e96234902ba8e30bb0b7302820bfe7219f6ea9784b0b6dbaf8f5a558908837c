"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const compat_1 = require("../utils/compat");
exports.default = (0, utils_1.createRule)("valid-compile", {
    meta: {
        docs: {
            description: "disallow warnings when compiling.",
            category: "Possible Errors",
            recommended: true,
        },
        schema: [],
        messages: {},
        type: "problem",
    },
    create(context) {
        const sourceCode = (0, compat_1.getSourceCode)(context);
        if (!sourceCode.parserServices.isAstro) {
            return {};
        }
        const diagnostics = sourceCode.parserServices.getAstroResult().diagnostics;
        return {
            Program() {
                for (const { text, code, location, severity } of diagnostics) {
                    if (severity === 2) {
                        context.report({
                            loc: {
                                start: location,
                                end: location,
                            },
                            message: `${text} [${code}]`,
                        });
                    }
                }
            },
        };
    },
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const compat_1 = require("../utils/compat");
const eslint_utils_1 = require("@eslint-community/eslint-utils");
const ast_utils_1 = require("../utils/ast-utils");
const fix_tracker_1 = __importDefault(require("../utils/fix-tracker"));
exports.default = (0, utils_1.createRule)("semi", {
    meta: {
        docs: {
            description: "Require or disallow semicolons instead of ASI",
            category: "Extension Rules",
            recommended: false,
            extensionRule: "semi",
        },
        type: "layout",
        fixable: "code",
        schema: {
            anyOf: [
                {
                    type: "array",
                    items: [
                        {
                            type: "string",
                            enum: ["never"],
                        },
                        {
                            type: "object",
                            properties: {
                                beforeStatementContinuationChars: {
                                    type: "string",
                                    enum: ["always", "any", "never"],
                                },
                            },
                            additionalProperties: false,
                        },
                    ],
                    minItems: 0,
                    maxItems: 2,
                },
                {
                    type: "array",
                    items: [
                        {
                            type: "string",
                            enum: ["always"],
                        },
                        {
                            type: "object",
                            properties: {
                                omitLastInOneLineBlock: { type: "boolean" },
                                omitLastInOneLineClassBody: { type: "boolean" },
                            },
                            additionalProperties: false,
                        },
                    ],
                    minItems: 0,
                    maxItems: 2,
                },
            ],
        },
        messages: {
            missingSemi: "Missing semicolon.",
            extraSemi: "Extra semicolon.",
        },
    },
    create(context) {
        const sourceCode = (0, compat_1.getSourceCode)(context);
        if (!sourceCode.parserServices.isAstro) {
            return {};
        }
        const OPT_OUT_PATTERN = /^[(+\-/[`]/u;
        const unsafeClassFieldNames = new Set(["get", "set", "static"]);
        const unsafeClassFieldFollowers = new Set(["*", "in", "instanceof"]);
        const options = context.options[1];
        const never = context.options[0] === "never";
        const exceptOneLine = Boolean(options &&
            "omitLastInOneLineBlock" in options &&
            options.omitLastInOneLineBlock);
        const exceptOneLineClassBody = Boolean(options &&
            "omitLastInOneLineClassBody" in options &&
            options.omitLastInOneLineClassBody);
        const beforeStatementContinuationChars = (options &&
            "beforeStatementContinuationChars" in options &&
            options.beforeStatementContinuationChars) ||
            "any";
        function report(node, missing = false) {
            const lastToken = sourceCode.getLastToken(node);
            let messageId = "missingSemi";
            let fix, loc;
            if (!missing) {
                loc = {
                    start: lastToken.loc.end,
                    end: (0, ast_utils_1.getNextLocation)(sourceCode, lastToken.loc.end),
                };
                fix = function (fixer) {
                    return fixer.insertTextAfter(lastToken, ";");
                };
            }
            else {
                messageId = "extraSemi";
                loc = lastToken.loc;
                fix = function (fixer) {
                    return new fix_tracker_1.default(fixer, sourceCode)
                        .retainSurroundingTokens(lastToken)
                        .remove(lastToken);
                };
            }
            context.report({
                node,
                loc,
                messageId,
                fix,
            });
        }
        function isRedundantSemi(semiToken) {
            const nextToken = sourceCode.getTokenAfter(semiToken);
            return (!nextToken ||
                (0, eslint_utils_1.isClosingBraceToken)(nextToken) ||
                (0, eslint_utils_1.isSemicolonToken)(nextToken));
        }
        function isEndOfArrowBlock(lastToken) {
            if (!(0, eslint_utils_1.isClosingBraceToken)(lastToken))
                return false;
            const node = sourceCode.getNodeByRangeIndex(lastToken.range[0]);
            return (node.type === "BlockStatement" &&
                node.parent.type === "ArrowFunctionExpression");
        }
        function maybeClassFieldAsiHazard(node) {
            if (node.type !== "PropertyDefinition")
                return false;
            const needsNameCheck = !node.computed && node.key.type === "Identifier";
            if (needsNameCheck &&
                "name" in node.key &&
                unsafeClassFieldNames.has(node.key.name)) {
                const isStaticStatic = node.static && node.key.name === "static";
                if (!isStaticStatic && !node.value)
                    return true;
            }
            const followingToken = sourceCode.getTokenAfter(node);
            return unsafeClassFieldFollowers.has(followingToken.value);
        }
        function isOnSameLineWithNextToken(node) {
            const prevToken = sourceCode.getLastToken(node, 1);
            const nextToken = sourceCode.getTokenAfter(node);
            return Boolean(nextToken) && (0, ast_utils_1.isTokenOnSameLine)(prevToken, nextToken);
        }
        function maybeAsiHazardAfter(node) {
            const t = node.type;
            if (t === "DoWhileStatement" ||
                t === "BreakStatement" ||
                t === "ContinueStatement" ||
                t === "DebuggerStatement" ||
                t === "ImportDeclaration" ||
                t === "ExportAllDeclaration")
                return false;
            if (t === "ReturnStatement")
                return Boolean(node.argument);
            if (t === "ExportNamedDeclaration")
                return Boolean(node.declaration);
            const lastToken = sourceCode.getLastToken(node, 1);
            if (isEndOfArrowBlock(lastToken))
                return false;
            return true;
        }
        function maybeAsiHazardBefore(token) {
            return (Boolean(token) &&
                OPT_OUT_PATTERN.test(token.value) &&
                token.value !== "++" &&
                token.value !== "--" &&
                token.value !== "---");
        }
        function canRemoveSemicolon(node) {
            const lastToken = sourceCode.getLastToken(node);
            if (isRedundantSemi(lastToken))
                return true;
            if (maybeClassFieldAsiHazard(node))
                return false;
            if (isOnSameLineWithNextToken(node))
                return false;
            if (node.type !== "PropertyDefinition" &&
                beforeStatementContinuationChars === "never" &&
                !maybeAsiHazardAfter(node))
                return true;
            const nextToken = sourceCode.getTokenAfter(node);
            if (!maybeAsiHazardBefore(nextToken))
                return true;
            return false;
        }
        function isLastInOneLinerBlock(node) {
            const parent = node.parent;
            const nextToken = sourceCode.getTokenAfter(node);
            if (!nextToken || nextToken.value !== "}")
                return false;
            if (parent.type === "BlockStatement")
                return parent.loc.start.line === parent.loc.end.line;
            if (parent.type === "StaticBlock") {
                const openingBrace = sourceCode.getFirstToken(parent, {
                    skip: 1,
                });
                return openingBrace.loc.start.line === parent.loc.end.line;
            }
            return false;
        }
        function isLastInOneLinerClassBody(node) {
            const parent = node.parent;
            const nextToken = sourceCode.getTokenAfter(node);
            if (!nextToken || nextToken.value !== "}")
                return false;
            if (parent.type === "ClassBody")
                return parent.loc.start.line === parent.loc.end.line;
            return false;
        }
        function checkForSemicolon(node) {
            const lastToken = sourceCode.getLastToken(node);
            const isSemi = (0, eslint_utils_1.isSemicolonToken)(lastToken);
            if (never) {
                const nextToken = sourceCode.getTokenAfter(node);
                if (isSemi && canRemoveSemicolon(node))
                    report(node, true);
                else if (!isSemi &&
                    beforeStatementContinuationChars === "always" &&
                    node.type !== "PropertyDefinition" &&
                    maybeAsiHazardBefore(nextToken))
                    report(node);
            }
            else {
                const oneLinerBlock = exceptOneLine && isLastInOneLinerBlock(node);
                const oneLinerClassBody = exceptOneLineClassBody && isLastInOneLinerClassBody(node);
                const oneLinerBlockOrClassBody = oneLinerBlock || oneLinerClassBody;
                if (isSemi && oneLinerBlockOrClassBody)
                    report(node, true);
                else if (!isSemi && !oneLinerBlockOrClassBody)
                    report(node);
            }
        }
        function checkForSemicolonForVariableDeclaration(node) {
            const parent = node.parent;
            if ((parent.type !== "ForStatement" || parent.init !== node) &&
                (!/^For(?:In|Of)Statement/u.test(parent.type) ||
                    parent.left !== node))
                checkForSemicolon(node);
        }
        return {
            VariableDeclaration: checkForSemicolonForVariableDeclaration,
            ExpressionStatement: checkForSemicolon,
            ReturnStatement: checkForSemicolon,
            ThrowStatement: checkForSemicolon,
            DoWhileStatement: checkForSemicolon,
            DebuggerStatement: checkForSemicolon,
            BreakStatement: checkForSemicolon,
            ContinueStatement: checkForSemicolon,
            ImportDeclaration: checkForSemicolon,
            ExportAllDeclaration: checkForSemicolon,
            ExportNamedDeclaration(node) {
                if (!node.declaration)
                    checkForSemicolon(node);
            },
            ExportDefaultDeclaration(node) {
                if (node.declaration.type === "TSInterfaceDeclaration")
                    return;
                if (!/(?:Class|Function)Declaration/u.test(node.declaration.type))
                    checkForSemicolon(node);
            },
            PropertyDefinition: checkForSemicolon,
            TSAbstractPropertyDefinition: checkForSemicolon,
            TSDeclareFunction: checkForSemicolon,
            TSExportAssignment: checkForSemicolon,
            TSImportEqualsDeclaration: checkForSemicolon,
            TSTypeAliasDeclaration: checkForSemicolon,
            TSEmptyBodyFunctionExpression: checkForSemicolon,
        };
    },
});

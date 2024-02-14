"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const volar_service_typescript_1 = __importDefault(require("volar-service-typescript"));
const index_js_1 = require("../../core/index.js");
const codeActions_js_1 = require("./codeActions.js");
const completions_js_1 = require("./completions.js");
const diagnostics_js_1 = require("./diagnostics.js");
const create = () => (context, modules) => {
    const typeScriptPlugin = (0, volar_service_typescript_1.default)()(context, modules);
    if (!context) {
        return {
            triggerCharacters: typeScriptPlugin.triggerCharacters,
            signatureHelpTriggerCharacters: typeScriptPlugin.signatureHelpTriggerCharacters,
            signatureHelpRetriggerCharacters: typeScriptPlugin.signatureHelpRetriggerCharacters,
        };
    }
    return {
        ...typeScriptPlugin,
        async provideCompletionItems(document, position, completionContext, token) {
            const originalCompletions = await typeScriptPlugin.provideCompletionItems(document, position, completionContext, token);
            if (!originalCompletions)
                return null;
            return (0, completions_js_1.enhancedProvideCompletionItems)(originalCompletions);
        },
        async resolveCompletionItem(item, token) {
            const resolvedCompletionItem = await typeScriptPlugin.resolveCompletionItem(item, token);
            if (!resolvedCompletionItem)
                return item;
            return (0, completions_js_1.enhancedResolveCompletionItem)(resolvedCompletionItem, context);
        },
        async provideCodeActions(document, range, codeActionContext, token) {
            const originalCodeActions = await typeScriptPlugin.provideCodeActions(document, range, codeActionContext, token);
            if (!originalCodeActions)
                return null;
            return (0, codeActions_js_1.enhancedProvideCodeActions)(originalCodeActions, context);
        },
        async resolveCodeAction(codeAction, token) {
            const resolvedCodeAction = await typeScriptPlugin.resolveCodeAction(codeAction, token);
            if (!resolvedCodeAction)
                return codeAction;
            return (0, codeActions_js_1.enhancedResolveCodeAction)(resolvedCodeAction, context);
        },
        async provideSemanticDiagnostics(document, token) {
            const [_, source] = context.documents.getVirtualFileByUri(document.uri);
            const file = source?.root;
            let tsxLineCount = undefined;
            if (file instanceof index_js_1.AstroFile) {
                // If we have compiler errors, our TSX isn't valid so don't bother showing TS errors
                if (file.hasCompilationErrors)
                    return null;
                // We'll use this to filter out diagnostics that are outside the mapped range of the TSX
                tsxLineCount = file.astroMeta.tsxRanges.body.end.line;
            }
            const diagnostics = await typeScriptPlugin.provideSemanticDiagnostics(document, token);
            if (!diagnostics)
                return null;
            return (0, diagnostics_js_1.enhancedProvideSemanticDiagnostics)(diagnostics, tsxLineCount);
        },
    };
};
exports.create = create;
//# sourceMappingURL=index.js.map
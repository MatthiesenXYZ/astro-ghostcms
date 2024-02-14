"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhancedResolveCodeAction = exports.enhancedProvideCodeActions = void 0;
const language_server_1 = require("@volar/language-server");
const index_js_1 = require("../../core/index.js");
const utils_js_1 = require("../utils.js");
function enhancedProvideCodeActions(codeActions, context) {
    return codeActions.map((codeAction) => mapCodeAction(codeAction, context));
}
exports.enhancedProvideCodeActions = enhancedProvideCodeActions;
function enhancedResolveCodeAction(codeAction, context) {
    /**
     * TypeScript code actions don't come through here, as they're considered to be already fully resolved
     * A lot of the code actions we'll encounter here are more tricky ones, such as fixAll or refactor
     * For now, it seems like we don't need to do anything special here, but we'll keep this function around
     */
    return mapCodeAction(codeAction, context);
}
exports.enhancedResolveCodeAction = enhancedResolveCodeAction;
function mapCodeAction(codeAction, context) {
    if (!codeAction.edit || !codeAction.edit.documentChanges)
        return codeAction;
    codeAction.edit.documentChanges = codeAction.edit.documentChanges.map((change) => {
        if (language_server_1.TextDocumentEdit.is(change)) {
            const [virtualFile, source] = context.documents.getVirtualCodeByUri(change.textDocument.uri);
            const code = source?.generated?.code;
            if (!virtualFile || !(code instanceof index_js_1.AstroVirtualCode))
                return change;
            change.edits = change.edits.map((edit) => {
                const shouldModifyEdit = (0, utils_js_1.editShouldBeInFrontmatter)(edit.range, code.astroMeta);
                if (shouldModifyEdit.itShould) {
                    edit = (0, utils_js_1.ensureProperEditForFrontmatter)(edit, code.astroMeta, '\n');
                }
                return edit;
            });
        }
        return change;
    });
    return codeAction;
}
//# sourceMappingURL=codeActions.js.map
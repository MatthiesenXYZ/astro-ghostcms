"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const getFormatCodeSettings_1 = require("../configs/getFormatCodeSettings");
const getUserPreferences_1 = require("../configs/getUserPreferences");
const shared_1 = require("../shared");
const rename_1 = require("./rename");
function register(ctx) {
    return async (oldUri, newUri) => {
        const document = ctx.getTextDocument(oldUri);
        const [formatOptions, preferences] = document ? await Promise.all([
            (0, getFormatCodeSettings_1.getFormatCodeSettings)(ctx, document),
            (0, getUserPreferences_1.getUserPreferences)(ctx, document),
        ]) : [{}, {}];
        const fileToRename = ctx.uriToFileName(oldUri);
        const newFilePath = ctx.uriToFileName(newUri);
        const response = (0, shared_1.safeCall)(() => ctx.languageService.getEditsForFileRename(fileToRename, newFilePath, formatOptions, preferences));
        if (!response?.length)
            return;
        const edits = (0, rename_1.fileTextChangesToWorkspaceEdit)(response, ctx);
        return edits;
    };
}
exports.register = register;
//# sourceMappingURL=fileRename.js.map
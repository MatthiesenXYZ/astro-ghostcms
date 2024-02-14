"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormatter = void 0;
const language_service_1 = require("@volar/language-service");
const ts = require("typescript");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const createServiceEnvironment_1 = require("./createServiceEnvironment");
function createFormatter(languages, services) {
    let fakeUri = 'file:///dummy.txt';
    let settings = {};
    const env = (0, createServiceEnvironment_1.createServiceEnvironment)(() => settings);
    const files = (0, language_service_1.createFileRegistry)(languages, false, () => { });
    const service = (0, language_service_1.createLanguageService)({ files }, services, env);
    return {
        env,
        format,
        get settings() {
            return settings;
        },
        set settings(v) {
            settings = v;
        },
    };
    async function format(content, languageId, options) {
        const snapshot = ts.ScriptSnapshot.fromString(content);
        files.set(fakeUri, languageId, snapshot);
        const document = service.context.documents.get(fakeUri, languageId, snapshot);
        const edits = await service.format(fakeUri, options, undefined, undefined);
        if (edits?.length) {
            const newString = vscode_languageserver_textdocument_1.TextDocument.applyEdits(document, edits);
            return newString;
        }
        return content;
    }
}
exports.createFormatter = createFormatter;
//# sourceMappingURL=createFormatter.js.map
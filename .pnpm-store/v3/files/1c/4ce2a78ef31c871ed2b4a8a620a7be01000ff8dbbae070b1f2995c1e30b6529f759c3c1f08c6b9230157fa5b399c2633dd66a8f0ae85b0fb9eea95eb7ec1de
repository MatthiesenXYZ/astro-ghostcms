"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const language_server_1 = require("@volar/language-server");
const volar_service_html_1 = require("volar-service-html");
const index_js_1 = require("../core/index.js");
const html_data_js_1 = require("./html-data.js");
const utils_js_1 = require("./utils.js");
const create = () => {
    const htmlServicePlugin = (0, volar_service_html_1.create)();
    return {
        ...htmlServicePlugin,
        create(context) {
            const htmlPlugin = htmlServicePlugin.create(context);
            htmlPlugin.provide['html/updateCustomData']?.([
                html_data_js_1.astroAttributes,
                html_data_js_1.astroElements,
                html_data_js_1.classListAttribute,
            ]);
            return {
                ...htmlPlugin,
                async provideCompletionItems(document, position, completionContext, token) {
                    if (document.languageId !== 'html')
                        return;
                    const [_, source] = context.documents.getVirtualCodeByUri(document.uri);
                    const code = source?.generated?.code;
                    if (!(code instanceof index_js_1.AstroVirtualCode))
                        return;
                    // Don't return completions if the current node is a component
                    if ((0, utils_js_1.isInComponentStartTag)(code.htmlDocument, document.offsetAt(position))) {
                        return null;
                    }
                    const completions = await htmlPlugin.provideCompletionItems(document, position, completionContext, token);
                    if (!completions) {
                        return null;
                    }
                    // We don't want completions for file references, as they're mostly invalid for Astro
                    completions.items = completions.items.filter((completion) => completion.kind !== language_server_1.CompletionItemKind.File);
                    return completions;
                },
                // Document links provided by `vscode-html-languageservice` are invalid for Astro
                provideDocumentLinks() {
                    return [];
                },
            };
        },
    };
};
exports.create = create;
//# sourceMappingURL=html.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractScriptTags = void 0;
const utils_1 = require("@astrojs/compiler/utils");
const language_core_1 = require("@volar/language-core");
const SourceMap = __importStar(require("@volar/source-map"));
const muggle = __importStar(require("muggle-string"));
function extractScriptTags(fileName, snapshot, htmlDocument, ast) {
    const embeddedJSFiles = findModuleScripts(fileName, snapshot, htmlDocument.roots);
    const javascriptContexts = [
        ...findClassicScripts(htmlDocument, snapshot),
        ...findEventAttributes(ast),
    ].sort((a, b) => a.startOffset - b.startOffset);
    if (javascriptContexts.length > 0) {
        // classic scripts share the same scope
        // merging them brings about redeclaration errors
        embeddedJSFiles.push(mergeJSContexts(fileName, javascriptContexts));
    }
    return embeddedJSFiles;
}
exports.extractScriptTags = extractScriptTags;
function getScriptType(scriptTag) {
    // script tags without attributes are processed and converted into module scripts
    if (!scriptTag.attributes || Object.entries(scriptTag.attributes).length === 0)
        return 'processed module';
    // even when it is not processed by vite, scripts with type=module remain modules
    if (scriptTag.attributes['type']?.includes('module') === true)
        return 'module';
    // whenever there are attributes, is:inline is implied and in the absence of type=module, the script is classic
    return 'classic';
}
/**
 * Get all the isolated scripts in the HTML document
 * Isolated scripts are scripts that are hoisted by Astro and as such, are isolated from the rest of the code because of the implicit `type="module"`
 * All the isolated scripts are passed to the TypeScript language server as separate `.mts` files.
 */
function findModuleScripts(fileName, snapshot, roots) {
    const embeddedScripts = [];
    let scriptIndex = 0;
    getEmbeddedScriptsInNodes(roots);
    function getEmbeddedScriptsInNodes(nodes) {
        for (const [_, node] of nodes.entries()) {
            if (node.tag === 'script' &&
                node.startTagEnd !== undefined &&
                node.endTagStart !== undefined &&
                getScriptType(node) !== 'classic') {
                const scriptText = snapshot.getText(node.startTagEnd, node.endTagStart);
                const extension = getScriptType(node) === 'processed module' ? 'mts' : 'mjs';
                embeddedScripts.push({
                    fileName: fileName + `.${scriptIndex}.${extension}`,
                    kind: language_core_1.FileKind.TypeScriptHostFile,
                    snapshot: {
                        getText: (start, end) => scriptText.substring(start, end),
                        getLength: () => scriptText.length,
                        getChangeRange: () => undefined,
                    },
                    codegenStacks: [],
                    mappings: [
                        {
                            sourceRange: [node.startTagEnd, node.endTagStart],
                            generatedRange: [0, scriptText.length],
                            data: language_core_1.FileRangeCapabilities.full,
                        },
                    ],
                    capabilities: {
                        diagnostic: true,
                        codeAction: true,
                        inlayHint: true,
                        documentSymbol: true,
                        foldingRange: true,
                        documentFormatting: false,
                    },
                    embeddedFiles: [],
                });
                scriptIndex++;
            }
            if (node.children)
                getEmbeddedScriptsInNodes(node.children);
        }
    }
    return embeddedScripts;
}
/**
 * Get all the inline scripts in the HTML document
 * Inline scripts are scripts that are not hoisted by Astro and as such, are not isolated from the rest of the code.
 * All the inline scripts are concatenated into a single `.mjs` file and passed to the TypeScript language server.
 */
function findClassicScripts(htmlDocument, snapshot) {
    const inlineScripts = [];
    getInlineScriptsInNodes(htmlDocument.roots);
    function getInlineScriptsInNodes(nodes) {
        for (const [_, node] of nodes.entries()) {
            if (node.tag === 'script' &&
                node.startTagEnd !== undefined &&
                node.endTagStart !== undefined &&
                !isJSON(node.attributes?.type) &&
                getScriptType(node) === 'classic') {
                const scriptText = snapshot.getText(node.startTagEnd, node.endTagStart);
                inlineScripts.push({
                    startOffset: node.startTagEnd,
                    content: scriptText,
                });
            }
            if (node.children)
                getInlineScriptsInNodes(node.children);
        }
    }
    return inlineScripts;
}
/**
 * Include both MIME JSON types and `importmap` and `speculationrules` script types
 * See MIME Types -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 * See Script Types -> https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type
 */
const JSON_TYPES = ['application/json', 'application/ld+json', 'importmap', 'speculationrules'];
/**
 * Check if the script has a type, and if it's included in JSON_TYPES above.
 * @param type Found in the `type` attribute of the script tag
 */
function isJSON(type) {
    if (!type)
        return false;
    // HTML attributes are quoted, slice " and ' at the start and end of the string
    return JSON_TYPES.includes(type.slice(1, -1));
}
function findEventAttributes(ast) {
    const eventAttrs = [];
    // `@astrojs/compiler`'s `walk` method is async, so we can't use it here. Arf
    function walkDown(parent) {
        if (!parent.children)
            return;
        parent.children.forEach((child) => {
            if (utils_1.is.element(child)) {
                const eventAttribute = child.attributes.find((attr) => htmlEventAttributes.includes(attr.name) && attr.kind === 'quoted');
                if (eventAttribute && eventAttribute.position) {
                    eventAttrs.push({
                        // Add a semicolon to the end of the event attribute to attempt to prevent errors from spreading to the rest of the document
                        // This is not perfect, but it's better than nothing
                        // See: https://github.com/microsoft/vscode/blob/e8e04769ec817a3374c3eaa26a08d3ae491820d5/extensions/html-language-features/server/src/modes/embeddedSupport.ts#L192
                        content: eventAttribute.value + ';',
                        startOffset: eventAttribute.position.start.offset + `${eventAttribute.name}="`.length,
                    });
                }
            }
            if (utils_1.is.parent(child)) {
                walkDown(child);
            }
        });
    }
    walkDown(ast);
    return eventAttrs;
}
/**
 * Merge all the inline and non-hoisted scripts into a single `.mjs` file
 */
function mergeJSContexts(fileName, javascriptContexts) {
    const codes = [];
    for (const javascriptContext of javascriptContexts) {
        codes.push([
            javascriptContext.content,
            undefined,
            javascriptContext.startOffset,
            language_core_1.FileRangeCapabilities.full,
        ]);
    }
    const mappings = SourceMap.buildMappings(codes);
    const text = muggle.toString(codes);
    return {
        fileName: fileName + '.inline.mjs',
        codegenStacks: [],
        snapshot: {
            getText: (start, end) => text.substring(start, end),
            getLength: () => text.length,
            getChangeRange: () => undefined,
        },
        capabilities: {
            codeAction: true,
            diagnostic: true,
            documentFormatting: false,
            documentSymbol: true,
            foldingRange: true,
            inlayHint: true,
        },
        embeddedFiles: [],
        kind: language_core_1.FileKind.TypeScriptHostFile,
        mappings,
    };
}
const htmlEventAttributes = [
    'onabort',
    'onafterprint',
    'onauxclick',
    'onbeforematch',
    'onbeforeprint',
    'onbeforeunload',
    'onblur',
    'oncancel',
    'oncanplay',
    'oncanplaythrough',
    'onchange',
    'onclick',
    'onclose',
    'oncontextlost',
    'oncontextmenu',
    'oncontextrestored',
    'oncopy',
    'oncuechange',
    'oncut',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'ondurationchange',
    'onemptied',
    'onended',
    'onerror',
    'onfocus',
    'onformdata',
    'onhashchange',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onlanguagechange',
    'onload',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onmessage',
    'onmessageerror',
    'onmousedown',
    'onmouseenter',
    'onmouseleave',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onoffline',
    'ononline',
    'onpagehide',
    'onpageshow',
    'onpaste',
    'onpause',
    'onplay',
    'onplaying',
    'onpopstate',
    'onprogress',
    'onratechange',
    'onrejectionhandled',
    'onreset',
    'onresize',
    'onscroll',
    'onscrollend',
    'onsecuritypolicyviolation',
    'onseeked',
    'onseeking',
    'onselect',
    'onslotchange',
    'onstalled',
    'onstorage',
    'onsubmit',
    'onsuspend',
    'ontimeupdate',
    'ontoggle',
    'onunhandledrejection',
    'onunload',
    'onvolumechange',
    'onwaiting',
    'onwheel',
];
//# sourceMappingURL=parseJS.js.map
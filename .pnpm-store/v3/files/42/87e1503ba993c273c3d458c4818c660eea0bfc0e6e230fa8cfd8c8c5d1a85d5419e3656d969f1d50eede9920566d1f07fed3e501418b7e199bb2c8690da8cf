"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSvelteLanguageModule = void 0;
const language_core_1 = require("@volar/language-core");
const vscode_uri_1 = require("vscode-uri");
const utils_js_1 = require("./utils.js");
function getSvelteLanguageModule() {
    return {
        createVirtualCode(fileId, languageId, snapshot) {
            if (languageId === 'svelte') {
                const fileName = fileId.includes('://')
                    ? vscode_uri_1.URI.parse(fileId).fsPath.replace(/\\/g, '/')
                    : fileId;
                return new SvelteVirtualCode(fileName, snapshot);
            }
        },
        updateVirtualCode(_fileId, svelteCode, snapshot) {
            svelteCode.update(snapshot);
            return svelteCode;
        },
        typescript: {
            extraFileExtensions: [{ extension: 'svelte', isMixedContent: true, scriptKind: 7 }],
            getScript(svelteCode) {
                for (const code of (0, language_core_1.forEachEmbeddedCode)(svelteCode)) {
                    if (code.id === 'tsx') {
                        return {
                            code,
                            extension: '.tsx',
                            scriptKind: 4,
                        };
                    }
                }
            },
        },
    };
}
exports.getSvelteLanguageModule = getSvelteLanguageModule;
class SvelteVirtualCode {
    constructor(fileName, snapshot) {
        this.fileName = fileName;
        this.snapshot = snapshot;
        this.id = 'root';
        this.languageId = 'svelte';
        this.codegenStacks = [];
        this.onSnapshotUpdated();
    }
    update(newSnapshot) {
        this.snapshot = newSnapshot;
        this.onSnapshotUpdated();
    }
    onSnapshotUpdated() {
        this.mappings = [
            {
                sourceOffsets: [0],
                generatedOffsets: [0],
                lengths: [this.snapshot.getLength()],
                data: {
                    verification: true,
                    completion: true,
                    semantic: true,
                    navigation: true,
                    structure: true,
                    format: true,
                },
            },
        ];
        this.embeddedCodes = [];
        this.embeddedCodes.push((0, utils_js_1.framework2tsx)(this.fileName, this.snapshot.getText(0, this.snapshot.getLength()), 'svelte'));
    }
}
//# sourceMappingURL=svelte.js.map
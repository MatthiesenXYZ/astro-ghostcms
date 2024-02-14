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
exports.AstroFile = exports.getLanguageModule = void 0;
const language_core_1 = require("@volar/language-core");
const path = __importStar(require("node:path"));
const utils_js_1 = require("../utils.js");
const astro2tsx_1 = require("./astro2tsx");
const parseAstro_1 = require("./parseAstro");
const parseCSS_1 = require("./parseCSS");
const parseHTML_1 = require("./parseHTML");
const parseJS_js_1 = require("./parseJS.js");
function getLanguageModule(astroInstall, ts) {
    return {
        createVirtualFile(fileName, snapshot) {
            if (fileName.endsWith('.astro')) {
                return new AstroFile(fileName, snapshot, ts);
            }
        },
        updateVirtualFile(astroFile, snapshot) {
            astroFile.update(snapshot);
        },
        resolveHost(host) {
            return {
                ...host,
                resolveModuleName(moduleName, impliedNodeFormat) {
                    if (impliedNodeFormat === ts.ModuleKind.ESNext &&
                        (moduleName.endsWith('.astro') ||
                            moduleName.endsWith('.vue') ||
                            moduleName.endsWith('.svelte'))) {
                        return `${moduleName}.js`;
                    }
                    return host.resolveModuleName?.(moduleName, impliedNodeFormat) ?? moduleName;
                },
                getScriptFileNames() {
                    const languageServerTypesDirectory = (0, utils_js_1.getLanguageServerTypesDir)(ts);
                    const fileNames = host.getScriptFileNames();
                    const addedFileNames = [];
                    if (astroInstall) {
                        addedFileNames.push(...['./env.d.ts', './astro-jsx.d.ts'].map((filePath) => ts.sys.resolvePath(path.resolve(astroInstall.path, filePath))));
                        // If Astro version is < 4.0.8, add jsx-runtime-augment.d.ts to the files to fake `JSX` being available from "astro/jsx-runtime".
                        // TODO: Remove this once a majority of users are on Astro 4.0.8+, erika - 2023-12-28
                        if (astroInstall.version.major < 4 ||
                            (astroInstall.version.major === 4 &&
                                astroInstall.version.minor === 0 &&
                                astroInstall.version.patch < 8)) {
                            addedFileNames.push(...['./jsx-runtime-augment.d.ts'].map((filePath) => ts.sys.resolvePath(path.resolve(languageServerTypesDirectory, filePath))));
                            console.log(addedFileNames);
                        }
                    }
                    else {
                        // If we don't have an Astro installation, add the fallback types from the language server.
                        // See the README in packages/language-server/types for more information.
                        addedFileNames.push(...['./env.d.ts', './astro-jsx.d.ts', './jsx-runtime-fallback.d.ts'].map((f) => ts.sys.resolvePath(path.resolve(languageServerTypesDirectory, f))));
                    }
                    return [...fileNames, ...addedFileNames];
                },
                getCompilationSettings() {
                    const baseCompilationSettings = host.getCompilationSettings();
                    return {
                        ...baseCompilationSettings,
                        module: ts.ModuleKind.ESNext ?? 99,
                        target: ts.ScriptTarget.ESNext ?? 99,
                        jsx: ts.JsxEmit.Preserve ?? 1,
                        resolveJsonModule: true,
                        allowJs: true,
                        isolatedModules: true,
                        moduleResolution: baseCompilationSettings.moduleResolution === ts.ModuleResolutionKind.Classic ||
                            !baseCompilationSettings.moduleResolution
                            ? ts.ModuleResolutionKind.Node10
                            : baseCompilationSettings.moduleResolution,
                    };
                },
            };
        },
    };
}
exports.getLanguageModule = getLanguageModule;
class AstroFile {
    constructor(sourceFileName, snapshot, ts) {
        this.sourceFileName = sourceFileName;
        this.snapshot = snapshot;
        this.ts = ts;
        this.kind = language_core_1.FileKind.TextFile;
        this.capabilities = language_core_1.FileCapabilities.full;
        this.codegenStacks = [];
        this.fileName = sourceFileName;
        this.onSnapshotUpdated();
    }
    get hasCompilationErrors() {
        return this.compilerDiagnostics.filter((diag) => diag.severity === 1).length > 0;
    }
    update(newSnapshot) {
        this.snapshot = newSnapshot;
        this.onSnapshotUpdated();
    }
    onSnapshotUpdated() {
        this.mappings = [
            {
                sourceRange: [0, this.snapshot.getLength()],
                generatedRange: [0, this.snapshot.getLength()],
                data: language_core_1.FileRangeCapabilities.full,
            },
        ];
        this.compilerDiagnostics = [];
        const astroMetadata = (0, parseAstro_1.getAstroMetadata)(this.fileName, this.snapshot.getText(0, this.snapshot.getLength()));
        if (astroMetadata.diagnostics.length > 0) {
            this.compilerDiagnostics.push(...astroMetadata.diagnostics);
        }
        const { htmlDocument, virtualFile: htmlVirtualFile } = (0, parseHTML_1.parseHTML)(this.fileName, this.snapshot, astroMetadata.frontmatter.status === 'closed'
            ? astroMetadata.frontmatter.position.end.offset
            : 0);
        this.htmlDocument = htmlDocument;
        const scriptTags = (0, parseJS_js_1.extractScriptTags)(this.fileName, this.snapshot, htmlDocument, astroMetadata.ast);
        this.scriptFiles = scriptTags.map((scriptTag) => scriptTag.fileName);
        htmlVirtualFile.embeddedFiles.push(...(0, parseCSS_1.extractStylesheets)(this.fileName, this.snapshot, htmlDocument, astroMetadata.ast), ...scriptTags);
        this.embeddedFiles = [];
        this.embeddedFiles.push(htmlVirtualFile);
        const tsx = (0, astro2tsx_1.astro2tsx)(this.snapshot.getText(0, this.snapshot.getLength()), this.fileName, this.ts, htmlDocument);
        this.astroMeta = { ...astroMetadata, tsxRanges: tsx.ranges };
        this.compilerDiagnostics.push(...tsx.diagnostics);
        this.embeddedFiles.push(tsx.virtualFile);
    }
}
exports.AstroFile = AstroFile;
//# sourceMappingURL=index.js.map
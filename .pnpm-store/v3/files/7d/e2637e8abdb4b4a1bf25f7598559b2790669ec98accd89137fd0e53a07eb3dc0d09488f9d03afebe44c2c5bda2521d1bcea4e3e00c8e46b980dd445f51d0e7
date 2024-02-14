"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypeScriptServerProject = void 0;
const language_service_1 = require("@volar/language-service");
const typescript_1 = require("@volar/typescript");
const path = require("path-browserify");
const vscode = require("vscode-languageserver");
const uriMap_1 = require("../utils/uriMap");
async function createTypeScriptServerProject(tsconfig, context, serviceEnv, serverOptions, servicePlugins) {
    if (!context.ts) {
        throw '!context.ts';
    }
    let parsedCommandLine;
    let projectVersion = 0;
    let languageService;
    const { uriToFileName, fileNameToUri } = context.runtimeEnv;
    const ts = context.ts;
    const host = {
        getCurrentDirectory: () => uriToFileName(serviceEnv.workspaceFolder),
        getProjectVersion: () => projectVersion.toString(),
        getScriptFileNames: () => rootFiles,
        getScriptSnapshot: fileName => {
            askedFiles.pathSet(fileName, true);
            const doc = context.documents.get(fileNameToUri(fileName));
            if (doc) {
                return doc.getSnapshot();
            }
        },
        getCompilationSettings: () => parsedCommandLine.options,
        getLocalizedDiagnosticMessages: context.tsLocalized ? () => context.tsLocalized : undefined,
        getProjectReferences: () => parsedCommandLine.projectReferences,
        getLanguageId: uri => context.documents.get(uri)?.languageId ?? (0, language_service_1.resolveCommonLanguageId)(uri),
    };
    const sys = (0, typescript_1.createSys)(ts, serviceEnv, host);
    const languagePlugins = await serverOptions.getLanguagePlugins(serviceEnv, {
        typescript: {
            configFileName: typeof tsconfig === 'string' ? tsconfig : undefined,
            host,
            sys,
        },
    });
    const askedFiles = (0, uriMap_1.createUriMap)(fileNameToUri);
    const docChangeWatcher = context.documents.onDidChangeContent(() => {
        projectVersion++;
    });
    const fileWatch = serviceEnv.onDidChangeWatchedFiles?.(params => {
        onWorkspaceFilesChanged(params.changes);
    });
    let rootFiles = await getRootFiles(languagePlugins);
    return {
        askedFiles,
        serviceEnv,
        getLanguageService,
        getLanguageServiceDontCreate: () => languageService,
        tryAddFile(fileName) {
            if (!rootFiles.includes(fileName)) {
                rootFiles.push(fileName);
                projectVersion++;
            }
        },
        dispose,
        getParsedCommandLine: () => parsedCommandLine,
    };
    async function getRootFiles(languagePlugins) {
        parsedCommandLine = await createParsedCommandLine(ts, sys, uriToFileName(serviceEnv.workspaceFolder), tsconfig, languagePlugins.map(plugin => plugin.typescript?.extraFileExtensions ?? []).flat());
        return parsedCommandLine.fileNames;
    }
    function getLanguageService() {
        if (!languageService) {
            const language = (0, typescript_1.createLanguage)(ts, sys, languagePlugins, typeof tsconfig === 'string' ? tsconfig : undefined, host, {
                fileNameToFileId: serviceEnv.typescript.fileNameToUri,
                fileIdToFileName: serviceEnv.typescript.uriToFileName,
            });
            languageService = (0, language_service_1.createLanguageService)(language, servicePlugins, serviceEnv);
        }
        return languageService;
    }
    async function onWorkspaceFilesChanged(changes) {
        const creates = changes.filter(change => change.type === vscode.FileChangeType.Created);
        if (creates.length) {
            rootFiles = await getRootFiles(languagePlugins);
        }
        projectVersion++;
    }
    function dispose() {
        sys.dispose();
        languageService?.dispose();
        fileWatch?.dispose();
        docChangeWatcher.dispose();
    }
}
exports.createTypeScriptServerProject = createTypeScriptServerProject;
async function createParsedCommandLine(ts, sys, workspacePath, tsconfig, extraFileExtensions) {
    let content = {
        errors: [],
        fileNames: [],
        options: {},
    };
    let sysVersion;
    let newSysVersion = await sys.sync();
    while (sysVersion !== newSysVersion) {
        sysVersion = newSysVersion;
        try {
            if (typeof tsconfig === 'string') {
                const config = ts.readJsonConfigFile(tsconfig, sys.readFile);
                content = ts.parseJsonSourceFileConfigFileContent(config, sys, path.dirname(tsconfig), {}, tsconfig, undefined, extraFileExtensions);
            }
            else {
                content = ts.parseJsonConfigFileContent({ files: [] }, sys, workspacePath, tsconfig, workspacePath + '/jsconfig.json', undefined, extraFileExtensions);
            }
            // fix https://github.com/johnsoncodehk/volar/issues/1786
            // https://github.com/microsoft/TypeScript/issues/30457
            // patching ts server broke with outDir + rootDir + composite/incremental
            content.options.outDir = undefined;
            content.fileNames = content.fileNames.map(fileName => fileName.replace(/\\/g, '/'));
        }
        catch {
            // will be failed if web fs host first result not ready
        }
        newSysVersion = await sys.sync();
    }
    if (content) {
        return content;
    }
    return content;
}
//# sourceMappingURL=typescriptProject.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTSConfigs = exports.createTypeScriptProjectProvider = void 0;
const language_service_1 = require("@volar/language-service");
const path = require("path-browserify");
const vscode = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const isFileInDir_1 = require("../utils/isFileInDir");
const uriMap_1 = require("../utils/uriMap");
const inferredCompilerOptions_1 = require("./inferredCompilerOptions");
const simpleProjectProvider_1 = require("./simpleProjectProvider");
const typescriptProject_1 = require("./typescriptProject");
const rootTsConfigNames = ['tsconfig.json', 'jsconfig.json'];
const createTypeScriptProjectProvider = (context, serverOptions, servicePlugins) => {
    const { fileNameToUri, uriToFileName, fs } = context.runtimeEnv;
    const configProjects = (0, uriMap_1.createUriMap)(fileNameToUri);
    const inferredProjects = (0, uriMap_1.createUriMap)(fileNameToUri);
    const rootTsConfigs = new Set();
    const searchedDirs = new Set();
    context.onDidChangeWatchedFiles(({ changes }) => {
        const tsConfigChanges = changes.filter(change => rootTsConfigNames.includes(change.uri.substring(change.uri.lastIndexOf('/') + 1)));
        for (const change of tsConfigChanges) {
            if (change.type === vscode.FileChangeType.Created) {
                rootTsConfigs.add(uriToFileName(change.uri));
            }
            else if ((change.type === vscode.FileChangeType.Changed || change.type === vscode.FileChangeType.Deleted) && configProjects.uriHas(change.uri)) {
                if (change.type === vscode.FileChangeType.Deleted) {
                    rootTsConfigs.delete(uriToFileName(change.uri));
                }
                const project = configProjects.uriGet(change.uri);
                configProjects.uriDelete(change.uri);
                project?.then(project => project.dispose());
            }
        }
        if (tsConfigChanges.length) {
            context.reloadDiagnostics();
        }
        else {
            context.updateDiagnosticsAndSemanticTokens();
        }
    });
    context.workspaceFolders.onDidRemove(folder => {
        for (const uri of configProjects.uriKeys()) {
            const project = configProjects.uriGet(uri);
            project.then(project => {
                if (project.serviceEnv.workspaceFolder === folder.toString()) {
                    configProjects.uriDelete(uri);
                    project.dispose();
                }
            });
        }
    });
    return {
        async getProject(uri) {
            const tsconfig = await findMatchTSConfig(vscode_uri_1.URI.parse(uri));
            if (tsconfig) {
                return await getOrCreateConfiguredProject(tsconfig);
            }
            const workspaceFolder = (0, simpleProjectProvider_1.getWorkspaceFolder)(uri, context.workspaceFolders, uriToFileName);
            return await getOrCreateInferredProject(uri, workspaceFolder);
        },
        async getProjects() {
            return await Promise.all([
                ...configProjects.values(),
                ...inferredProjects.values(),
            ]);
        },
        reloadProjects() {
            for (const project of [...configProjects.values(), ...inferredProjects.values()]) {
                project.then(project => project.dispose());
            }
            configProjects.clear();
            inferredProjects.clear();
            context.reloadDiagnostics();
        },
    };
    async function findMatchTSConfig(uri) {
        const filePath = uriToFileName(uri.toString());
        let dir = path.dirname(filePath);
        while (true) {
            if (searchedDirs.has(dir)) {
                break;
            }
            searchedDirs.add(dir);
            for (const tsConfigName of rootTsConfigNames) {
                const tsconfigPath = path.join(dir, tsConfigName);
                if ((await fs.stat?.(fileNameToUri(tsconfigPath)))?.type === language_service_1.FileType.File) {
                    rootTsConfigs.add(tsconfigPath);
                }
            }
            dir = path.dirname(dir);
        }
        await prepareClosestootParsedCommandLine();
        return await findDirectIncludeTsconfig() ?? await findIndirectReferenceTsconfig();
        async function prepareClosestootParsedCommandLine() {
            let matches = [];
            for (const rootTsConfig of rootTsConfigs) {
                if ((0, isFileInDir_1.isFileInDir)(uriToFileName(uri.toString()), path.dirname(rootTsConfig))) {
                    matches.push(rootTsConfig);
                }
            }
            matches = matches.sort((a, b) => sortTSConfigs(uriToFileName(uri.toString()), a, b));
            if (matches.length) {
                await getParsedCommandLine(matches[0]);
            }
        }
        function findIndirectReferenceTsconfig() {
            return findTSConfig(async (tsconfig) => {
                const project = await configProjects.pathGet(tsconfig);
                return project?.askedFiles.uriHas(uri.toString()) ?? false;
            });
        }
        function findDirectIncludeTsconfig() {
            return findTSConfig(async (tsconfig) => {
                const map = (0, uriMap_1.createUriMap)(fileNameToUri);
                const parsedCommandLine = await getParsedCommandLine(tsconfig);
                for (const fileName of parsedCommandLine?.fileNames ?? []) {
                    map.pathSet(fileName, true);
                }
                return map.uriHas(uri.toString());
            });
        }
        async function findTSConfig(match) {
            const checked = new Set();
            for (const rootTsConfig of [...rootTsConfigs].sort((a, b) => sortTSConfigs(uriToFileName(uri.toString()), a, b))) {
                const project = await configProjects.pathGet(rootTsConfig);
                if (project) {
                    let chains = await getReferencesChains(project.getParsedCommandLine(), rootTsConfig, []);
                    if (context.initializeParams.initializationOptions?.reverseConfigFilePriority) {
                        chains = chains.reverse();
                    }
                    for (const chain of chains) {
                        for (let i = chain.length - 1; i >= 0; i--) {
                            const tsconfig = chain[i];
                            if (checked.has(tsconfig)) {
                                continue;
                            }
                            checked.add(tsconfig);
                            if (await match(tsconfig)) {
                                return tsconfig;
                            }
                        }
                    }
                }
            }
        }
        async function getReferencesChains(parsedCommandLine, tsConfig, before) {
            if (parsedCommandLine.projectReferences?.length) {
                const newChains = [];
                for (const projectReference of parsedCommandLine.projectReferences) {
                    let tsConfigPath = projectReference.path.replace(/\\/g, '/');
                    // fix https://github.com/johnsoncodehk/volar/issues/712
                    if ((await fs.stat?.(fileNameToUri(tsConfigPath)))?.type === language_service_1.FileType.File) {
                        const newTsConfigPath = path.join(tsConfigPath, 'tsconfig.json');
                        const newJsConfigPath = path.join(tsConfigPath, 'jsconfig.json');
                        if ((await fs.stat?.(fileNameToUri(newTsConfigPath)))?.type === language_service_1.FileType.File) {
                            tsConfigPath = newTsConfigPath;
                        }
                        else if ((await fs.stat?.(fileNameToUri(newJsConfigPath)))?.type === language_service_1.FileType.File) {
                            tsConfigPath = newJsConfigPath;
                        }
                    }
                    const beforeIndex = before.indexOf(tsConfigPath); // cycle
                    if (beforeIndex >= 0) {
                        newChains.push(before.slice(0, Math.max(beforeIndex, 1)));
                    }
                    else {
                        const referenceParsedCommandLine = await getParsedCommandLine(tsConfigPath);
                        if (referenceParsedCommandLine) {
                            for (const chain of await getReferencesChains(referenceParsedCommandLine, tsConfigPath, [...before, tsConfig])) {
                                newChains.push(chain);
                            }
                        }
                    }
                }
                return newChains;
            }
            else {
                return [[...before, tsConfig]];
            }
        }
        async function getParsedCommandLine(tsConfig) {
            const project = await getOrCreateConfiguredProject(tsConfig);
            return project?.getParsedCommandLine();
        }
    }
    function getOrCreateConfiguredProject(tsconfig) {
        tsconfig = tsconfig.replace(/\\/g, '/');
        let projectPromise = configProjects.pathGet(tsconfig);
        if (!projectPromise) {
            const workspaceFolder = (0, simpleProjectProvider_1.getWorkspaceFolder)(fileNameToUri(tsconfig), context.workspaceFolders, uriToFileName);
            const serviceEnv = (0, simpleProjectProvider_1.createServiceEnvironment)(context, workspaceFolder);
            projectPromise = (0, typescriptProject_1.createTypeScriptServerProject)(tsconfig, context, serviceEnv, serverOptions, servicePlugins);
            configProjects.pathSet(tsconfig, projectPromise);
        }
        return projectPromise;
    }
    async function getOrCreateInferredProject(uri, workspaceFolder) {
        if (!inferredProjects.uriHas(workspaceFolder.toString())) {
            inferredProjects.uriSet(workspaceFolder.toString(), (async () => {
                const inferOptions = await (0, inferredCompilerOptions_1.getInferredCompilerOptions)(context.configurationHost);
                const serviceEnv = (0, simpleProjectProvider_1.createServiceEnvironment)(context, workspaceFolder);
                return (0, typescriptProject_1.createTypeScriptServerProject)(inferOptions, context, serviceEnv, serverOptions, servicePlugins);
            })());
        }
        const project = await inferredProjects.uriGet(workspaceFolder.toString());
        project.tryAddFile(uriToFileName(uri));
        return project;
    }
};
exports.createTypeScriptProjectProvider = createTypeScriptProjectProvider;
function sortTSConfigs(file, a, b) {
    const inA = (0, isFileInDir_1.isFileInDir)(file, path.dirname(a));
    const inB = (0, isFileInDir_1.isFileInDir)(file, path.dirname(b));
    if (inA !== inB) {
        const aWeight = inA ? 1 : 0;
        const bWeight = inB ? 1 : 0;
        return bWeight - aWeight;
    }
    const aLength = a.split('/').length;
    const bLength = b.split('/').length;
    if (aLength === bLength) {
        const aWeight = path.basename(a) === 'tsconfig.json' ? 1 : 0;
        const bWeight = path.basename(b) === 'tsconfig.json' ? 1 : 0;
        return bWeight - aWeight;
    }
    return bLength - aLength;
}
exports.sortTSConfigs = sortTSConfigs;
//# sourceMappingURL=typescriptProjectProvider.js.map
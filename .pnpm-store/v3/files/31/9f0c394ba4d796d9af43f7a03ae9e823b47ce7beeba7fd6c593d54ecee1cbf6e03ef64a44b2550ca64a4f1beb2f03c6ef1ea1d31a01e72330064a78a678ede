"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceFolder = exports.createServiceEnvironment = exports.createSimpleProjectProvider = void 0;
const vscode_uri_1 = require("vscode-uri");
const isFileInDir_1 = require("../utils/isFileInDir");
const simpleProject_1 = require("./simpleProject");
const createSimpleProjectProvider = (context, serverOptions, servicePlugins) => {
    const projects = new Map();
    return {
        getProject(uri) {
            const workspaceFolder = getWorkspaceFolder(uri, context.workspaceFolders, context.runtimeEnv.uriToFileName);
            let projectPromise = projects.get(workspaceFolder);
            if (!projectPromise) {
                const serviceEnv = createServiceEnvironment(context, workspaceFolder);
                projectPromise = (0, simpleProject_1.createSimpleServerProject)(context, serviceEnv, serverOptions, servicePlugins);
                projects.set(workspaceFolder, projectPromise);
            }
            return projectPromise;
        },
        async getProjects() {
            return await Promise.all([...projects.values()]);
        },
        reloadProjects() {
            for (const project of projects.values()) {
                project.then(project => project.dispose());
            }
            projects.clear();
            context.reloadDiagnostics();
        },
    };
};
exports.createSimpleProjectProvider = createSimpleProjectProvider;
function createServiceEnvironment(context, workspaceFolder) {
    const env = {
        workspaceFolder: workspaceFolder.toString(),
        fs: context.runtimeEnv.fs,
        console: context.runtimeEnv.console,
        locale: context.initializeParams.locale,
        clientCapabilities: context.initializeParams.capabilities,
        getConfiguration: context.configurationHost?.getConfiguration,
        onDidChangeConfiguration: context.configurationHost?.onDidChangeConfiguration,
        onDidChangeWatchedFiles: context.onDidChangeWatchedFiles,
        typescript: {
            fileNameToUri: context.runtimeEnv.fileNameToUri,
            uriToFileName: context.runtimeEnv.uriToFileName,
        },
    };
    return env;
}
exports.createServiceEnvironment = createServiceEnvironment;
function getWorkspaceFolder(uri, workspaceFolderManager, uriToFileName) {
    const fileName = uriToFileName(uri);
    let folders = workspaceFolderManager
        .getAll()
        .filter(uri => (0, isFileInDir_1.isFileInDir)(fileName, uriToFileName(uri.toString())))
        .sort((a, b) => b.toString().length - a.toString().length);
    if (!folders.length) {
        folders = workspaceFolderManager.getAll();
    }
    if (!folders.length) {
        folders = [vscode_uri_1.URI.parse(uri).with({ path: '/' })];
    }
    return folders[0];
}
exports.getWorkspaceFolder = getWorkspaceFolder;
//# sourceMappingURL=simpleProjectProvider.js.map
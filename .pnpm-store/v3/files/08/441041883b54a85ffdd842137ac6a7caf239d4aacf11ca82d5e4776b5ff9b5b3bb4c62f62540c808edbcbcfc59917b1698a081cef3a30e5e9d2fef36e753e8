"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchExternalFiles = exports.decorateLanguageServiceHost = void 0;
const language_core_1 = require("@volar/language-core");
const resolveModuleName_1 = require("../resolveModuleName");
function decorateLanguageServiceHost(virtualFiles, languageServiceHost, ts) {
    let extraProjectVersion = 0;
    const { languagePlugins } = virtualFiles;
    const exts = languagePlugins
        .map(plugin => plugin.typescript?.extraFileExtensions.map(ext => '.' + ext.extension) ?? [])
        .flat();
    const scripts = new Map();
    const readDirectory = languageServiceHost.readDirectory?.bind(languageServiceHost);
    const resolveModuleNameLiterals = languageServiceHost.resolveModuleNameLiterals?.bind(languageServiceHost);
    const resolveModuleNames = languageServiceHost.resolveModuleNames?.bind(languageServiceHost);
    const getProjectVersion = languageServiceHost.getProjectVersion?.bind(languageServiceHost);
    const getScriptSnapshot = languageServiceHost.getScriptSnapshot.bind(languageServiceHost);
    const getScriptKind = languageServiceHost.getScriptKind?.bind(languageServiceHost);
    // path completion
    if (readDirectory) {
        languageServiceHost.readDirectory = (path, extensions, exclude, include, depth) => {
            if (extensions) {
                for (const ext of exts) {
                    if (!extensions.includes(ext)) {
                        extensions = [...extensions, ...ext];
                    }
                }
            }
            return readDirectory(path, extensions, exclude, include, depth);
        };
    }
    if (languagePlugins.some(language => language.typescript?.extraFileExtensions.length)) {
        const resolveModuleName = (0, resolveModuleName_1.createResolveModuleName)(ts, languageServiceHost, languagePlugins, fileName => virtualFiles.get(fileName));
        if (resolveModuleNameLiterals) {
            languageServiceHost.resolveModuleNameLiterals = (moduleLiterals, containingFile, redirectedReference, options, ...rest) => {
                return [
                    ...resolveModuleNameLiterals(moduleLiterals.filter(name => !exts.some(ext => name.text.endsWith(ext))), containingFile, redirectedReference, options, ...rest),
                    ...moduleLiterals
                        .filter(name => exts.some(ext => name.text.endsWith(ext)))
                        .map(name => resolveModuleName(name.text, containingFile, options, undefined, redirectedReference)),
                ];
            };
        }
        if (resolveModuleNames) {
            languageServiceHost.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile) => {
                return [
                    ...resolveModuleNames(moduleNames.filter(name => !exts.some(ext => name.endsWith(ext))), containingFile, reusedNames, redirectedReference, options, containingSourceFile),
                    ...moduleNames
                        .filter(name => exts.some(ext => name.endsWith(ext)))
                        .map(moduleName => resolveModuleName(moduleName, containingFile, options, undefined, redirectedReference).resolvedModule),
                ];
            };
        }
    }
    if (getProjectVersion) {
        languageServiceHost.getProjectVersion = () => {
            return getProjectVersion() + ':' + extraProjectVersion;
        };
    }
    languageServiceHost.getScriptSnapshot = fileName => {
        if (exts.some(ext => fileName.endsWith(ext))) {
            updateScript(fileName);
            return scripts.get(fileName)?.snapshot;
        }
        return getScriptSnapshot(fileName);
    };
    if (getScriptKind) {
        languageServiceHost.getScriptKind = fileName => {
            if (exts.some(ext => fileName.endsWith(ext))) {
                updateScript(fileName);
                const script = scripts.get(fileName);
                if (script) {
                    return script.kind;
                }
                return ts.ScriptKind.Deferred;
            }
            return getScriptKind(fileName);
        };
    }
    function updateScript(fileName) {
        const version = languageServiceHost.getScriptVersion(fileName);
        if (version !== scripts.get(fileName)?.version) {
            let extension = '.ts';
            let snapshotSnapshot;
            let scriptKind = ts.ScriptKind.TS;
            const snapshot = getScriptSnapshot(fileName);
            if (snapshot) {
                extraProjectVersion++;
                const sourceFile = virtualFiles.set(fileName, (0, language_core_1.resolveCommonLanguageId)(fileName), snapshot);
                if (sourceFile.generated) {
                    const text = snapshot.getText(0, snapshot.getLength());
                    let patchedText = text.split('\n').map(line => ' '.repeat(line.length)).join('\n');
                    const script = sourceFile.generated.languagePlugin.typescript?.getScript(sourceFile.generated.code);
                    if (script) {
                        extension = script.extension;
                        scriptKind = script.scriptKind;
                        patchedText += script.code.snapshot.getText(0, script.code.snapshot.getLength());
                    }
                    snapshotSnapshot = ts.ScriptSnapshot.fromString(patchedText);
                    if (sourceFile.generated.languagePlugin.typescript?.getExtraScripts) {
                        console.warn('getExtraScripts() is not available in this use case.');
                    }
                }
            }
            else if (virtualFiles.get(fileName)) {
                extraProjectVersion++;
                virtualFiles.delete(fileName);
            }
            scripts.set(fileName, {
                version,
                extension,
                snapshot: snapshotSnapshot,
                kind: scriptKind,
            });
        }
        return scripts.get(fileName);
    }
}
exports.decorateLanguageServiceHost = decorateLanguageServiceHost;
function searchExternalFiles(ts, project, exts) {
    if (project.projectKind !== ts.server.ProjectKind.Configured) {
        return [];
    }
    const configFile = project.getProjectName();
    const config = ts.readJsonConfigFile(configFile, project.readFile.bind(project));
    const parseHost = {
        useCaseSensitiveFileNames: project.useCaseSensitiveFileNames(),
        fileExists: project.fileExists.bind(project),
        readFile: project.readFile.bind(project),
        readDirectory: (...args) => {
            args[1] = exts;
            return project.readDirectory(...args);
        },
    };
    const parsed = ts.parseJsonSourceFileConfigFileContent(config, parseHost, project.getCurrentDirectory());
    return parsed.fileNames;
}
exports.searchExternalFiles = searchExternalFiles;
//# sourceMappingURL=decorateLanguageServiceHost.js.map
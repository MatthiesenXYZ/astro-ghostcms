"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypeScriptInferredChecker = exports.createTypeScriptChecker = void 0;
const language_service_1 = require("@volar/language-service");
const path = require("typesafe-path/posix");
const ts = require("typescript");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const createServiceEnvironment_1 = require("./createServiceEnvironment");
const utils_1 = require("./utils");
const typescript_1 = require("@volar/typescript");
function createTypeScriptChecker(languages, services, tsconfig) {
    const tsconfigPath = (0, utils_1.asPosix)(tsconfig);
    return createTypeScriptCheckerWorker(languages, services, tsconfigPath, env => {
        return createTypeScriptLanguageHost(env, () => {
            const parsed = ts.parseJsonSourceFileConfigFileContent(ts.readJsonConfigFile(tsconfigPath, ts.sys.readFile), ts.sys, path.dirname(tsconfigPath), undefined, tsconfigPath, undefined, languages.map(plugin => plugin.typescript?.extraFileExtensions ?? []).flat());
            parsed.fileNames = parsed.fileNames.map(utils_1.asPosix);
            return parsed;
        });
    });
}
exports.createTypeScriptChecker = createTypeScriptChecker;
function createTypeScriptInferredChecker(languages, services, getScriptFileNames, compilerOptions = utils_1.defaultCompilerOptions) {
    return createTypeScriptCheckerWorker(languages, services, undefined, env => {
        return createTypeScriptLanguageHost(env, () => ({
            options: compilerOptions,
            fileNames: getScriptFileNames().map(utils_1.asPosix),
        }));
    });
}
exports.createTypeScriptInferredChecker = createTypeScriptInferredChecker;
function createTypeScriptCheckerWorker(languages, services, configFileName, getProjectHost) {
    let settings = {};
    const env = (0, createServiceEnvironment_1.createServiceEnvironment)(() => settings);
    const didChangeWatchedFilesCallbacks = new Set();
    env.onDidChangeWatchedFiles = cb => {
        didChangeWatchedFilesCallbacks.add(cb);
        return {
            dispose: () => {
                didChangeWatchedFilesCallbacks.delete(cb);
            },
        };
    };
    const languageHost = getProjectHost(env);
    const language = (0, typescript_1.createLanguage)(ts, ts.sys, languages, configFileName, languageHost, {
        fileNameToFileId: env.typescript.fileNameToUri,
        fileIdToFileName: env.typescript.uriToFileName,
    });
    const service = (0, language_service_1.createLanguageService)(language, services, env);
    return {
        // apis
        check,
        fixErrors,
        printErrors,
        languageHost,
        // settings
        get settings() {
            return settings;
        },
        set settings(v) {
            settings = v;
        },
        // file events
        fileCreated(fileName) {
            fileEvent(fileName, 1);
        },
        fileUpdated(fileName) {
            fileEvent(fileName, 2);
        },
        fileDeleted(fileName) {
            fileEvent(fileName, 3);
        },
    };
    function fileEvent(fileName, type) {
        fileName = (0, utils_1.asPosix)(fileName);
        for (const cb of didChangeWatchedFilesCallbacks) {
            cb({ changes: [{ uri: (0, utils_1.fileNameToUri)(fileName), type }] });
        }
    }
    function check(fileName) {
        fileName = (0, utils_1.asPosix)(fileName);
        const uri = (0, utils_1.fileNameToUri)(fileName);
        return service.doValidation(uri);
    }
    async function fixErrors(fileName, diagnostics, only, writeFile) {
        fileName = (0, utils_1.asPosix)(fileName);
        const uri = (0, utils_1.fileNameToUri)(fileName);
        const sourceFile = service.context.language.files.get(uri);
        if (sourceFile) {
            const document = service.context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
            const range = { start: document.positionAt(0), end: document.positionAt(document.getText().length) };
            const codeActions = await service.doCodeActions(uri, range, { diagnostics, only, triggerKind: 1 });
            if (codeActions) {
                for (let i = 0; i < codeActions.length; i++) {
                    codeActions[i] = await service.doCodeActionResolve(codeActions[i]);
                }
                const edits = codeActions.map(codeAction => codeAction.edit).filter((edit) => !!edit);
                if (edits.length) {
                    const rootEdit = edits[0];
                    (0, language_service_1.mergeWorkspaceEdits)(rootEdit, ...edits.slice(1));
                    for (const uri in rootEdit.changes ?? {}) {
                        const edits = rootEdit.changes[uri];
                        if (edits.length) {
                            const editFile = service.context.language.files.get(uri);
                            if (editFile) {
                                const editDocument = service.context.documents.get(uri, editFile.languageId, editFile.snapshot);
                                const newString = vscode_languageserver_textdocument_1.TextDocument.applyEdits(editDocument, edits);
                                await writeFile((0, utils_1.uriToFileName)(uri), newString);
                            }
                        }
                    }
                    for (const change of rootEdit.documentChanges ?? []) {
                        if ('textDocument' in change) {
                            const editFile = service.context.language.files.get(change.textDocument.uri);
                            if (editFile) {
                                const editDocument = service.context.documents.get(change.textDocument.uri, editFile.languageId, editFile.snapshot);
                                const newString = vscode_languageserver_textdocument_1.TextDocument.applyEdits(editDocument, change.edits);
                                await writeFile((0, utils_1.uriToFileName)(change.textDocument.uri), newString);
                            }
                        }
                        // TODO: CreateFile | RenameFile | DeleteFile
                    }
                }
            }
        }
    }
    function printErrors(fileName, diagnostics, rootPath = process.cwd()) {
        let text = formatErrors(fileName, diagnostics, rootPath);
        for (const diagnostic of diagnostics) {
            text = text.replace(`TS${diagnostic.code}`, (diagnostic.source ?? '') + (diagnostic.code ? `(${diagnostic.code})` : ''));
        }
        return text;
    }
    function formatErrors(fileName, diagnostics, rootPath) {
        fileName = (0, utils_1.asPosix)(fileName);
        const uri = (0, utils_1.fileNameToUri)(fileName);
        const sourceFile = service.context.language.files.get(uri);
        const document = service.context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
        const errors = diagnostics.map(diagnostic => ({
            category: diagnostic.severity === 1 ? ts.DiagnosticCategory.Error : ts.DiagnosticCategory.Warning,
            code: diagnostic.code,
            file: ts.createSourceFile(fileName, document.getText(), ts.ScriptTarget.JSON),
            start: document.offsetAt(diagnostic.range.start),
            length: document.offsetAt(diagnostic.range.end) - document.offsetAt(diagnostic.range.start),
            messageText: diagnostic.message,
        }));
        const text = ts.formatDiagnosticsWithColorAndContext(errors, {
            getCurrentDirectory: () => rootPath,
            getCanonicalFileName: fileName => ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
            getNewLine: () => ts.sys.newLine,
        });
        return text;
    }
}
function createTypeScriptLanguageHost(env, createParsedCommandLine) {
    let scriptSnapshotsCache = new Map();
    let parsedCommandLine = createParsedCommandLine();
    let projectVersion = 0;
    let shouldCheckRootFiles = false;
    const host = {
        getCurrentDirectory: () => {
            return (0, utils_1.uriToFileName)(env.workspaceFolder);
        },
        getCompilationSettings: () => {
            return parsedCommandLine.options;
        },
        getProjectVersion: () => {
            checkRootFilesUpdate();
            return projectVersion.toString();
        },
        getScriptFileNames: () => {
            checkRootFilesUpdate();
            return parsedCommandLine.fileNames;
        },
        getScriptSnapshot: fileName => {
            if (!scriptSnapshotsCache.has(fileName)) {
                const fileText = ts.sys.readFile(fileName, 'utf8');
                if (fileText !== undefined) {
                    scriptSnapshotsCache.set(fileName, ts.ScriptSnapshot.fromString(fileText));
                }
                else {
                    scriptSnapshotsCache.set(fileName, undefined);
                }
            }
            return scriptSnapshotsCache.get(fileName);
        },
        getLanguageId: language_service_1.resolveCommonLanguageId,
    };
    env.onDidChangeWatchedFiles?.(({ changes }) => {
        for (const change of changes) {
            const fileName = (0, utils_1.uriToFileName)(change.uri);
            if (change.type === 2) {
                if (scriptSnapshotsCache.has(fileName)) {
                    projectVersion++;
                    scriptSnapshotsCache.delete(fileName);
                }
            }
            else if (change.type === 3) {
                if (scriptSnapshotsCache.has(fileName)) {
                    projectVersion++;
                    scriptSnapshotsCache.delete(fileName);
                    parsedCommandLine.fileNames = parsedCommandLine.fileNames.filter(name => name !== fileName);
                }
            }
            else if (change.type === 1) {
                shouldCheckRootFiles = true;
            }
        }
    });
    return host;
    function checkRootFilesUpdate() {
        if (!shouldCheckRootFiles) {
            return;
        }
        shouldCheckRootFiles = false;
        const newParsedCommandLine = createParsedCommandLine();
        if (!arrayItemsEqual(newParsedCommandLine.fileNames, parsedCommandLine.fileNames)) {
            parsedCommandLine.fileNames = newParsedCommandLine.fileNames;
            projectVersion++;
        }
    }
}
function arrayItemsEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    const set = new Set(a);
    for (const file of b) {
        if (!set.has(file)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=createChecker.js.map
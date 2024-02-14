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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const semver = require("semver");
const shared_1 = require("./lib/shared");
const vscode_uri_1 = require("vscode-uri");
const typescript_1 = require("@volar/typescript");
const tsFaster = require("typescript-auto-import-cache");
const _callHierarchy = require("./lib/features/callHierarchy");
const codeActions = require("./lib/features/codeAction");
const codeActionResolve = require("./lib/features/codeActionResolve");
const completions = require("./lib/features/completions/basic");
const directiveCommentCompletions = require("./lib/features/completions/directiveComment");
const jsDocCompletions = require("./lib/features/completions/jsDoc");
const completionResolve = require("./lib/features/completions/resolve");
const definitions = require("./lib/features/definition");
const diagnostics = require("./lib/features/diagnostics");
const documentHighlight = require("./lib/features/documentHighlight");
const documentSymbol = require("./lib/features/documentSymbol");
const fileReferences = require("./lib/features/fileReferences");
const fileRename = require("./lib/features/fileRename");
const foldingRanges = require("./lib/features/foldingRanges");
const formatting = require("./lib/features/formatting");
const hover = require("./lib/features/hover");
const implementation = require("./lib/features/implementation");
const inlayHints = require("./lib/features/inlayHints");
const prepareRename = require("./lib/features/prepareRename");
const references = require("./lib/features/references");
const rename = require("./lib/features/rename");
const selectionRanges = require("./lib/features/selectionRanges");
const semanticTokens = require("./lib/features/semanticTokens");
const signatureHelp = require("./lib/features/signatureHelp");
const typeDefinitions = require("./lib/features/typeDefinition");
const workspaceSymbols = require("./lib/features/workspaceSymbol");
__exportStar(require("@volar/typescript"), exports);
;
function create(ts) {
    const basicTriggerCharacters = getBasicTriggerCharacters(ts.version);
    const jsDocTriggerCharacter = '*';
    const directiveCommentTriggerCharacter = '@';
    return {
        name: 'typescript',
        triggerCharacters: [
            ...basicTriggerCharacters,
            jsDocTriggerCharacter,
            directiveCommentTriggerCharacter,
        ],
        signatureHelpTriggerCharacters: ['(', ',', '<'],
        signatureHelpRetriggerCharacters: [')'],
        // https://github.com/microsoft/vscode/blob/ce119308e8fd4cd3f992d42b297588e7abe33a0c/extensions/typescript-language-features/src/languageFeatures/formatting.ts#L99
        autoFormatTriggerCharacters: [';', '}', '\n'],
        create(context) {
            const syntacticServiceHost = {
                getProjectVersion: () => syntacticHostCtx.projectVersion.toString(),
                getScriptFileNames: () => [syntacticHostCtx.fileName],
                getScriptVersion: fileName => fileName === syntacticHostCtx.fileName ? syntacticHostCtx.fileVersion.toString() : '',
                getScriptSnapshot: fileName => fileName === syntacticHostCtx.fileName ? syntacticHostCtx.snapshot : undefined,
                getCompilationSettings: () => ({}),
                getCurrentDirectory: () => '/',
                getDefaultLibFileName: () => '',
                readFile: () => undefined,
                fileExists: fileName => fileName === syntacticHostCtx.fileName,
            };
            const syntacticCtx = {
                ...context,
                languageServiceHost: syntacticServiceHost,
                languageService: ts.createLanguageService(syntacticServiceHost, undefined, 2),
                ts,
                uriToFileName: uri => {
                    if (uri !== syntacticHostCtx.document?.uri) {
                        throw new Error(`uriToFileName: uri not found: ${uri}`);
                    }
                    return syntacticHostCtx.fileName;
                },
                fileNameToUri: fileName => {
                    if (fileName !== syntacticHostCtx.fileName) {
                        throw new Error(`fileNameToUri: fileName not found: ${fileName}`);
                    }
                    return syntacticHostCtx.document.uri;
                },
                getTextDocument(uri) {
                    if (uri !== syntacticHostCtx.document?.uri) {
                        throw new Error(`getTextDocument: uri not found: ${uri}`);
                    }
                    return syntacticHostCtx.document;
                },
            };
            const findDocumentSymbols = documentSymbol.register(syntacticCtx);
            const doFormatting = formatting.register(syntacticCtx);
            const getFoldingRanges = foldingRanges.register(syntacticCtx);
            const syntacticService = {
                provide: {
                    'typescript/typescript': () => ts,
                    'typescript/languageService': () => syntacticCtx.languageService,
                    'typescript/languageServiceHost': () => syntacticCtx.languageServiceHost,
                    'typescript/syntacticLanguageService': () => syntacticCtx.languageService,
                    'typescript/syntacticLanguageServiceHost': () => syntacticCtx.languageServiceHost,
                },
                provideAutoInsertionEdit(document, position, lastChange) {
                    if ((document.languageId === 'javascriptreact' || document.languageId === 'typescriptreact')
                        && lastChange.text.endsWith('>')) {
                        const config = context.env.getConfiguration?.((0, shared_1.getConfigTitle)(document) + '.autoClosingTags') ?? true;
                        if (config) {
                            const ctx = prepareSyntacticService(document);
                            const close = syntacticCtx.languageService.getJsxClosingTagAtPosition(ctx.fileName, document.offsetAt(position));
                            if (close) {
                                return '$0' + close.newText;
                            }
                        }
                    }
                },
                provideFoldingRanges(document) {
                    if (!(0, shared_1.isTsDocument)(document))
                        return;
                    prepareSyntacticService(document);
                    return getFoldingRanges(document.uri);
                },
                provideDocumentSymbols(document) {
                    if (!(0, shared_1.isTsDocument)(document))
                        return;
                    prepareSyntacticService(document);
                    return findDocumentSymbols(document.uri);
                },
                async provideDocumentFormattingEdits(document, range, options_2) {
                    if (!(0, shared_1.isTsDocument)(document))
                        return;
                    const enable = await context.env.getConfiguration?.((0, shared_1.getConfigTitle)(document) + '.format.enable') ?? true;
                    if (!enable) {
                        return;
                    }
                    prepareSyntacticService(document);
                    return await doFormatting.onRange(document, range, options_2);
                },
                async provideOnTypeFormattingEdits(document, position, key, options_2) {
                    if (!(0, shared_1.isTsDocument)(document))
                        return;
                    const enable = await context.env.getConfiguration?.((0, shared_1.getConfigTitle)(document) + '.format.enable') ?? true;
                    if (!enable) {
                        return;
                    }
                    prepareSyntacticService(document);
                    return doFormatting.onType(document, options_2, position, key);
                },
                provideFormattingIndentSensitiveLines(document) {
                    if (!(0, shared_1.isTsDocument)(document))
                        return;
                    const ctx = prepareSyntacticService(document);
                    const sourceFile = ts.createSourceFile(ctx.fileName, document.getText(), ts.ScriptTarget.ESNext);
                    if (sourceFile) {
                        const lines = [];
                        sourceFile.forEachChild(function walk(node) {
                            if (node.kind === ts.SyntaxKind.FirstTemplateToken
                                || node.kind === ts.SyntaxKind.LastTemplateToken
                                || node.kind === ts.SyntaxKind.TemplateHead) {
                                const startLine = document.positionAt(node.getStart(sourceFile)).line;
                                const endLine = document.positionAt(node.getEnd()).line;
                                for (let i = startLine + 1; i <= endLine; i++) {
                                    lines.push(i);
                                }
                            }
                            node.forEachChild(walk);
                        });
                        return lines;
                    }
                },
            };
            const syntacticHostCtx = {
                projectVersion: -1,
                document: undefined,
                fileName: '',
                fileVersion: 0,
                snapshot: ts.ScriptSnapshot.fromString(''),
            };
            if (!context.language.typescript) {
                return syntacticService;
            }
            const { sys, languageServiceHost } = context.language.typescript;
            const created = tsFaster.createLanguageService(ts, sys, languageServiceHost, proxiedHost => ts.createLanguageService(proxiedHost, (0, typescript_1.getDocumentRegistry)(ts, sys.useCaseSensitiveFileNames, languageServiceHost.getCurrentDirectory())));
            const { languageService } = created;
            if (created.setPreferences && context.env.getConfiguration) {
                updatePreferences();
                context.env.onDidChangeConfiguration?.(updatePreferences);
                async function updatePreferences() {
                    const preferences = await context.env.getConfiguration?.('typescript.preferences');
                    if (preferences) {
                        created.setPreferences?.(preferences);
                    }
                }
            }
            if (created.projectUpdated) {
                const sourceScriptNames = new Set();
                const normalizeFileName = sys.useCaseSensitiveFileNames
                    ? (id) => id
                    : (id) => id.toLowerCase();
                updateSourceScriptFileNames();
                context.env.onDidChangeWatchedFiles?.((params) => {
                    const someFileCreateOrDeiete = params.changes.some(change => change.type !== 2);
                    if (someFileCreateOrDeiete) {
                        updateSourceScriptFileNames();
                    }
                    for (const change of params.changes) {
                        const fileName = context.env.typescript.uriToFileName(change.uri);
                        if (sourceScriptNames.has(normalizeFileName(fileName))) {
                            created.projectUpdated?.(languageServiceHost.getCurrentDirectory());
                        }
                    }
                });
                function updateSourceScriptFileNames() {
                    sourceScriptNames.clear();
                    for (const fileName of languageServiceHost.getScriptFileNames()) {
                        const uri = context.env.typescript.fileNameToUri(fileName);
                        const sourceFile = context.language.files.get(uri);
                        if (sourceFile?.generated) {
                            const tsCode = sourceFile.generated.languagePlugin.typescript?.getScript(sourceFile.generated.code);
                            if (tsCode) {
                                sourceScriptNames.add(normalizeFileName(fileName));
                            }
                        }
                        else if (sourceFile) {
                            sourceScriptNames.add(normalizeFileName(fileName));
                        }
                    }
                }
            }
            const semanticCtx = {
                ...context,
                languageServiceHost,
                languageService,
                ts,
                uriToFileName(uri) {
                    const virtualScript = getVirtualScriptByUri(uri);
                    if (virtualScript) {
                        return virtualScript.fileName;
                    }
                    return context.env.typescript.uriToFileName(uri);
                },
                fileNameToUri(fileName) {
                    const uri = context.env.typescript.fileNameToUri(fileName);
                    const sourceFile = context.language.files.get(uri);
                    const extraScript = context.language.typescript.getExtraScript(fileName);
                    let virtualCode = extraScript?.code;
                    if (!virtualCode && sourceFile?.generated?.languagePlugin.typescript) {
                        const mainScript = sourceFile.generated.languagePlugin.typescript.getScript(sourceFile.generated.code);
                        if (mainScript) {
                            virtualCode = mainScript.code;
                        }
                    }
                    if (virtualCode) {
                        const sourceFile = context.language.files.getByVirtualCode(virtualCode);
                        return context.documents.getVirtualCodeUri(sourceFile.id, virtualCode.id);
                    }
                    return uri;
                },
                getTextDocument(uri) {
                    const virtualCode = context.documents.getVirtualCodeByUri(uri)[0];
                    if (virtualCode) {
                        return context.documents.get(uri, virtualCode.languageId, virtualCode.snapshot);
                    }
                    const sourceFile = context.language.files.get(uri);
                    if (sourceFile) {
                        return context.documents.get(uri, sourceFile.languageId, sourceFile.snapshot);
                    }
                },
            };
            const findDefinition = definitions.register(semanticCtx);
            const findTypeDefinition = typeDefinitions.register(semanticCtx);
            const findReferences = references.register(semanticCtx);
            const findFileReferences = fileReferences.register(semanticCtx);
            const findImplementations = implementation.register(semanticCtx);
            const doPrepareRename = prepareRename.register(semanticCtx);
            const doRename = rename.register(semanticCtx);
            const getEditsForFileRename = fileRename.register(semanticCtx);
            const getCodeActions = codeActions.register(semanticCtx);
            const doCodeActionResolve = codeActionResolve.register(semanticCtx);
            const getInlayHints = inlayHints.register(semanticCtx);
            const findDocumentHighlights = documentHighlight.register(semanticCtx);
            const findWorkspaceSymbols = workspaceSymbols.register(semanticCtx);
            const doComplete = completions.register(semanticCtx);
            const doCompletionResolve = completionResolve.register(semanticCtx);
            const doDirectiveCommentComplete = directiveCommentCompletions.register(semanticCtx);
            const doJsDocComplete = jsDocCompletions.register(semanticCtx);
            const doHover = hover.register(semanticCtx);
            const getSignatureHelp = signatureHelp.register(semanticCtx);
            const getSelectionRanges = selectionRanges.register(semanticCtx);
            const doValidation = diagnostics.register(semanticCtx);
            const getDocumentSemanticTokens = semanticTokens.register(semanticCtx);
            const callHierarchy = _callHierarchy.register(semanticCtx);
            return {
                ...syntacticService,
                provide: {
                    ...syntacticService.provide,
                    'typescript/languageService': () => languageService,
                    'typescript/languageServiceHost': () => languageServiceHost,
                },
                dispose() {
                    languageService.dispose();
                },
                async provideCompletionItems(document, position, completeContext, token) {
                    if (!isSemanticDocument(document))
                        return;
                    const enable = await context.env.getConfiguration?.((0, shared_1.getConfigTitle)(document) + '.suggest.enabled') ?? true;
                    if (!enable) {
                        return;
                    }
                    return await worker(token, async () => {
                        let result = {
                            isIncomplete: false,
                            items: [],
                        };
                        if (!completeContext || completeContext.triggerKind !== 2 || (completeContext.triggerCharacter && basicTriggerCharacters.includes(completeContext.triggerCharacter))) {
                            const completeOptions = {
                                triggerCharacter: completeContext.triggerCharacter,
                                triggerKind: completeContext.triggerKind,
                            };
                            const basicResult = await doComplete(document.uri, position, completeOptions);
                            if (basicResult) {
                                result = basicResult;
                            }
                        }
                        if (!completeContext || completeContext.triggerKind !== 2 || completeContext.triggerCharacter === jsDocTriggerCharacter) {
                            const jsdocResult = await doJsDocComplete(document.uri, position);
                            if (jsdocResult) {
                                result.items.push(jsdocResult);
                            }
                        }
                        if (!completeContext || completeContext.triggerKind !== 2 || completeContext.triggerCharacter === directiveCommentTriggerCharacter) {
                            const directiveCommentResult = await doDirectiveCommentComplete(document.uri, position);
                            if (directiveCommentResult) {
                                result.items = result.items.concat(directiveCommentResult);
                            }
                        }
                        return result;
                    });
                },
                resolveCompletionItem(item, token) {
                    return worker(token, () => {
                        return doCompletionResolve(item);
                    });
                },
                provideRenameRange(document, position, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return doPrepareRename(document.uri, position);
                    });
                },
                provideRenameEdits(document, position, newName, token) {
                    if (!isSemanticDocument(document, true))
                        return;
                    return worker(token, () => {
                        return doRename(document.uri, position, newName);
                    });
                },
                provideCodeActions(document, range, context, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return getCodeActions(document.uri, range, context);
                    });
                },
                resolveCodeAction(codeAction, token) {
                    return worker(token, () => {
                        return doCodeActionResolve(codeAction);
                    });
                },
                provideInlayHints(document, range, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return getInlayHints(document.uri, range);
                    });
                },
                provideCallHierarchyItems(document, position, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return callHierarchy.doPrepare(document.uri, position);
                    });
                },
                provideCallHierarchyIncomingCalls(item, token) {
                    return worker(token, () => {
                        return callHierarchy.getIncomingCalls(item);
                    });
                },
                provideCallHierarchyOutgoingCalls(item, token) {
                    return worker(token, () => {
                        return callHierarchy.getOutgoingCalls(item);
                    });
                },
                provideDefinition(document, position, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return findDefinition(document.uri, position);
                    });
                },
                provideTypeDefinition(document, position, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return findTypeDefinition(document.uri, position);
                    });
                },
                async provideDiagnostics(document, token) {
                    if (!isSemanticDocument(document))
                        return;
                    const enable = await context.env.getConfiguration?.((0, shared_1.getConfigTitle)(document) + '.validate.enable') ?? true;
                    if (!enable) {
                        return;
                    }
                    return await worker(token, () => {
                        return doValidation(document.uri, { syntactic: true, suggestion: true });
                    });
                },
                provideSemanticDiagnostics(document, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return doValidation(document.uri, { semantic: true, declaration: true });
                    });
                },
                provideHover(document, position, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return doHover(document.uri, position);
                    });
                },
                provideImplementation(document, position, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return findImplementations(document.uri, position);
                    });
                },
                provideReferences(document, position, referenceContext, token) {
                    if (!isSemanticDocument(document, true))
                        return;
                    return worker(token, () => {
                        return findReferences(document.uri, position, referenceContext);
                    });
                },
                provideFileReferences(document, token) {
                    if (!isSemanticDocument(document, true))
                        return;
                    return worker(token, () => {
                        return findFileReferences(document.uri);
                    });
                },
                provideDocumentHighlights(document, position, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return findDocumentHighlights(document.uri, position);
                    });
                },
                provideDocumentSemanticTokens(document, range, legend, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return getDocumentSemanticTokens(document.uri, range, legend);
                    });
                },
                provideWorkspaceSymbols(query, token) {
                    return worker(token, () => {
                        return findWorkspaceSymbols(query);
                    });
                },
                provideFileRenameEdits(oldUri, newUri, token) {
                    return worker(token, () => {
                        return getEditsForFileRename(oldUri, newUri);
                    });
                },
                provideSelectionRanges(document, positions, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return getSelectionRanges(document.uri, positions);
                    });
                },
                provideSignatureHelp(document, position, context, token) {
                    if (!isSemanticDocument(document))
                        return;
                    return worker(token, () => {
                        return getSignatureHelp(document.uri, position, context);
                    });
                },
            };
            function isSemanticDocument(document, withJson = false) {
                const virtualScript = getVirtualScriptByUri(document.uri);
                if (virtualScript) {
                    return true;
                }
                if (withJson && (0, shared_1.isJsonDocument)(document)) {
                    return true;
                }
                return (0, shared_1.isTsDocument)(document);
            }
            function getVirtualScriptByUri(uri) {
                const [virtualCode, sourceFile] = context.documents.getVirtualCodeByUri(uri);
                if (virtualCode && sourceFile.generated?.languagePlugin.typescript) {
                    const { getScript, getExtraScripts } = sourceFile.generated?.languagePlugin.typescript;
                    const sourceFileName = context.env.typescript.uriToFileName(sourceFile.id);
                    if (getScript(sourceFile.generated.code)?.code === virtualCode) {
                        return {
                            fileName: sourceFileName,
                            code: virtualCode,
                        };
                    }
                    for (const extraScript of getExtraScripts?.(sourceFileName, sourceFile.generated.code) ?? []) {
                        if (extraScript.code === virtualCode) {
                            return extraScript;
                        }
                    }
                }
            }
            async function worker(token, callback) {
                let oldSysVersion = await sys.sync?.();
                let result = await callback();
                let newSysVersion = await sys.sync?.();
                while (newSysVersion !== oldSysVersion && !token.isCancellationRequested) {
                    oldSysVersion = newSysVersion;
                    result = await callback();
                    newSysVersion = await sys.sync?.();
                }
                return result;
            }
            function prepareSyntacticService(document) {
                if (syntacticHostCtx.document !== document || syntacticHostCtx.fileVersion !== document.version) {
                    syntacticHostCtx.document = document;
                    syntacticHostCtx.fileName = vscode_uri_1.URI.parse(document.uri).fsPath.replace(/\\/g, '/');
                    syntacticHostCtx.fileVersion = document.version;
                    syntacticHostCtx.snapshot = ts.ScriptSnapshot.fromString(document.getText());
                    syntacticHostCtx.projectVersion++;
                }
                return syntacticHostCtx;
            }
        },
    };
}
exports.create = create;
function getBasicTriggerCharacters(tsVersion) {
    const triggerCharacters = ['.', '"', '\'', '`', '/', '<'];
    // https://github.com/microsoft/vscode/blob/8e65ae28d5fb8b3c931135da1a41edb9c80ae46f/extensions/typescript-language-features/src/languageFeatures/completions.ts#L811-L833
    if (semver.lt(tsVersion, '3.1.0') || semver.gte(tsVersion, '3.2.0')) {
        triggerCharacters.push('@');
    }
    if (semver.gte(tsVersion, '3.8.1')) {
        triggerCharacters.push('#');
    }
    if (semver.gte(tsVersion, '4.3.0')) {
        triggerCharacters.push(' ');
    }
    return triggerCharacters;
}
//# sourceMappingURL=index.js.map
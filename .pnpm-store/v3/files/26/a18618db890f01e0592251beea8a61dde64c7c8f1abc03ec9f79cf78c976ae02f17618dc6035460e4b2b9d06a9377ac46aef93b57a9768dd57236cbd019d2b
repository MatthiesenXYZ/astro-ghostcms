import { LanguagePlugin, ServiceEnvironment, ServicePlugin } from '@volar/language-service';
import * as vscode from 'vscode-languageserver';
import { InitializationOptions, ProjectContext, ServerProjectProvider, ServerProjectProviderFactory, ServerRuntimeEnvironment } from './types.js';
import { createConfigurationHost } from './configurationHost.js';
import { WorkspaceFolderManager } from './workspaceFolderManager.js';
import { SnapshotDocument } from '@volar/snapshot-document';
import type * as ts from 'typescript';
import type { TextDocuments } from 'vscode-languageserver';
export interface ServerContext {
    connection: vscode.Connection;
    initializeParams: Omit<vscode.InitializeParams, 'initializationOptions'> & {
        initializationOptions?: InitializationOptions;
    };
    runtimeEnv: ServerRuntimeEnvironment;
    onDidChangeWatchedFiles: vscode.Connection['onDidChangeWatchedFiles'];
    configurationHost: ReturnType<typeof createConfigurationHost> | undefined;
    ts: typeof import('typescript') | undefined;
    tsLocalized: ts.MapLike<string> | undefined;
    workspaceFolders: WorkspaceFolderManager;
    documents: TextDocuments<SnapshotDocument>;
    reloadDiagnostics(): void;
    updateDiagnosticsAndSemanticTokens(): void;
}
export interface ServerOptions {
    watchFileExtensions?: string[];
    getServicePlugins(): ServicePlugin[] | Promise<ServicePlugin[]>;
    getLanguagePlugins(serviceEnv: ServiceEnvironment, projectContext: ProjectContext): LanguagePlugin[] | Promise<LanguagePlugin[]>;
}
export declare function createServerBase(connection: vscode.Connection, getRuntimeEnv: (params: ServerContext['initializeParams']) => ServerRuntimeEnvironment): {
    initialize: (params: ServerContext['initializeParams'], projectProviderFactory: ServerProjectProviderFactory, _serverOptions: ServerOptions) => Promise<vscode.InitializeResult<any>>;
    initialized: () => void;
    shutdown: () => void;
    readonly projects: ServerProjectProvider;
    readonly env: ServerRuntimeEnvironment;
    readonly modules: {
        typescript: typeof ts | undefined;
    };
};

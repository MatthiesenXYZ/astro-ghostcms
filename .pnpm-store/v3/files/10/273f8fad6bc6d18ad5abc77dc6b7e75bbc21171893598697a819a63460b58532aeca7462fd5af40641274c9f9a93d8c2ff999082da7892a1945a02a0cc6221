import * as vscode from 'vscode-languageserver';
import { InitializationOptions, LanguageServerPlugin, RuntimeEnvironment } from '../types.js';
import { createConfigurationHost } from './configurationHost.js';
export interface ServerContext {
    server: {
        initializeParams: vscode.InitializeParams;
        connection: vscode.Connection;
        runtimeEnv: RuntimeEnvironment;
        plugins: LanguageServerPlugin[];
        onDidChangeWatchedFiles: vscode.Connection['onDidChangeWatchedFiles'];
        configurationHost: ReturnType<typeof createConfigurationHost> | undefined;
    };
}
export declare function startCommonLanguageServer(connection: vscode.Connection, _plugins: LanguageServerPlugin[], getRuntimeEnv: (params: vscode.InitializeParams, options: InitializationOptions) => RuntimeEnvironment): void;
//# sourceMappingURL=server.d.ts.map
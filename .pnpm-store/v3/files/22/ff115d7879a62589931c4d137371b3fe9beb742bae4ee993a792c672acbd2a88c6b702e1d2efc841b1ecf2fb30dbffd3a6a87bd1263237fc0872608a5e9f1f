import * as vscode from 'vscode-languageserver/browser';
export * from 'vscode-languageserver/browser';
export * from './index';
export * from './lib/project/simpleProjectProvider';
export * from './lib/project/typescriptProjectProvider';
export declare function createConnection(): vscode.Connection;
export declare function createServer(connection: vscode.Connection): {
    initialize: (params: Omit<vscode.InitializeParams, "initializationOptions"> & {
        initializationOptions?: import("./index").InitializationOptions | undefined;
    }, projectProviderFactory: import("./index").ServerProjectProviderFactory, _serverOptions: import("./lib/server").ServerOptions) => Promise<vscode.InitializeResult<any>>;
    initialized: () => void;
    shutdown: () => void;
    readonly projects: import("./index").ServerProjectProvider;
    readonly env: import("./index").ServerRuntimeEnvironment;
    readonly modules: {
        typescript: typeof import("typescript") | undefined;
    };
};

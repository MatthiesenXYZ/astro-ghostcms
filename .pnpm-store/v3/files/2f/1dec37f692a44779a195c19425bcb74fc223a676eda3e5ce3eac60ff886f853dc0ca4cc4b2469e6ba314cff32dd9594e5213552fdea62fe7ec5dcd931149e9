import { FileSystem } from '@volar/language-service';
import * as vscode from 'vscode-languageserver/node';
import type { InitializationOptions } from './lib/types';
export * from 'vscode-languageserver/node';
export * from './index';
export * from './lib/project/simpleProjectProvider';
export * from './lib/project/typescriptProjectProvider';
export declare const uriToFileName: (uri: string) => string;
export declare const fileNameToUri: (fileName: string) => string;
export declare function createFs(options: InitializationOptions): FileSystem;
export declare function createConnection(): vscode._Connection<vscode._, vscode._, vscode._, vscode._, vscode._, vscode._, import("vscode-languageserver/lib/common/inlineCompletion.proposed").InlineCompletionFeatureShape, vscode._>;
export declare function createServer(connection: vscode.Connection): {
    initialize: (params: Omit<vscode.InitializeParams, "initializationOptions"> & {
        initializationOptions?: InitializationOptions | undefined;
    }, projectProviderFactory: import("./index").ServerProjectProviderFactory, _serverOptions: import("./lib/server").ServerOptions) => Promise<vscode.InitializeResult<any>>;
    initialized: () => void;
    shutdown: () => void;
    readonly projects: import("./index").ServerProjectProvider;
    readonly env: import("./index").ServerRuntimeEnvironment;
    readonly modules: {
        typescript: typeof import("typescript") | undefined;
    };
};

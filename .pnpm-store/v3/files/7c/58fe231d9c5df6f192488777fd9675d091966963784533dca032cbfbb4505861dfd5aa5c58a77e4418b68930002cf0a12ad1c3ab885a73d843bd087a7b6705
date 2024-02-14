import type { ServiceEnvironment } from '@volar/language-service';
import { URI } from 'vscode-uri';
import type { ServerProjectProviderFactory } from '../types';
import type { WorkspaceFolderManager } from '../workspaceFolderManager';
import type { ServerContext } from '../server';
export declare const createSimpleProjectProvider: ServerProjectProviderFactory;
export declare function createServiceEnvironment(context: ServerContext, workspaceFolder: URI): ServiceEnvironment;
export declare function getWorkspaceFolder(uri: string, workspaceFolderManager: WorkspaceFolderManager, uriToFileName: (uri: string) => string): URI;

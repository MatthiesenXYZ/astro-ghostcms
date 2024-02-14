import { ServiceEnvironment, ServicePlugin } from '@volar/language-service';
import type * as ts from 'typescript';
import type { ServerProject } from '../types';
import { UriMap } from '../utils/uriMap';
import type { ServerContext, ServerOptions } from '../server';
export interface TypeScriptServerProject extends ServerProject {
    askedFiles: UriMap<boolean>;
    tryAddFile(fileName: string): void;
    getParsedCommandLine(): ts.ParsedCommandLine;
}
export declare function createTypeScriptServerProject(tsconfig: string | ts.CompilerOptions, context: ServerContext, serviceEnv: ServiceEnvironment, serverOptions: ServerOptions, servicePlugins: ServicePlugin[]): Promise<TypeScriptServerProject>;

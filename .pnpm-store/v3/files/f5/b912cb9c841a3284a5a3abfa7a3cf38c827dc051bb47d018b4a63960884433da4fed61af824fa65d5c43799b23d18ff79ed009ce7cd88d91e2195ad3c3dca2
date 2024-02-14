import type { ServiceEnvironment, Disposable, TypeScriptProjectHost } from '@volar/language-service';
import type * as ts from 'typescript';
export declare function createSys(ts: typeof import('typescript'), env: ServiceEnvironment, projectHost: TypeScriptProjectHost): ts.System & {
    version: number;
    sync(): Promise<number>;
} & Disposable;

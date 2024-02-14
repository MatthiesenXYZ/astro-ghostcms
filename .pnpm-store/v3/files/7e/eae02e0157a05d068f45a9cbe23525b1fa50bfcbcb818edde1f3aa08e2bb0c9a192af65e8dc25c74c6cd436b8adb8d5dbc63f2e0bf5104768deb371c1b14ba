import type { HmrContext } from 'vite';
import type { Logger } from '../core/logger/core.js';
import type { CompileAstroResult } from './compile.js';
import type { CompileMetadata } from './types.js';
export interface HandleHotUpdateOptions {
    logger: Logger;
    compile: (code: string, filename: string) => Promise<CompileAstroResult>;
    astroFileToCssAstroDeps: Map<string, Set<string>>;
    astroFileToCompileMetadata: Map<string, CompileMetadata>;
}
export declare function handleHotUpdate(ctx: HmrContext, { logger, compile, astroFileToCssAstroDeps, astroFileToCompileMetadata }: HandleHotUpdateOptions): Promise<import("vite").ModuleNode[] | undefined>;

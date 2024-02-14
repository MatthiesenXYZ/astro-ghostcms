import { LanguagePlugin, LanguageContext, TypeScriptProjectHost } from '@volar/language-core';
import type * as ts from 'typescript';
import type { createSys } from './createSys';
export declare function createLanguage(ts: typeof import('typescript'), sys: ReturnType<typeof createSys> | ts.System, languagePlugins: LanguagePlugin<any>[], configFileName: string | undefined, projectHost: TypeScriptProjectHost, { fileIdToFileName, fileNameToFileId }: {
    fileIdToFileName: (uri: string) => string;
    fileNameToFileId: (fileName: string) => string;
}): LanguageContext;

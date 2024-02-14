import { SourceMap } from '@volar/source-map';
import type * as ts from 'typescript';
import { LinkedCodeMap } from './linkedCodeMap';
import type { CodeInformation, LanguagePlugin, SourceFile, VirtualCode } from './types';
export type FileRegistry = ReturnType<typeof createFileRegistry>;
export declare function createFileRegistry(languagePlugins: LanguagePlugin[], caseSensitive: boolean, sync: (id: string) => void): {
    languagePlugins: LanguagePlugin<VirtualCode<string>>[];
    set(id: string, languageId: string, snapshot: ts.IScriptSnapshot): SourceFile;
    delete(id: string): void;
    get(id: string): SourceFile | undefined;
    getByVirtualCode(virtualCode: VirtualCode): SourceFile;
    getLinkedCodeMap(virtualCode: VirtualCode): LinkedCodeMap | undefined;
    getMaps(virtualCode: VirtualCode): Map<string, [ts.IScriptSnapshot, SourceMap<CodeInformation>]>;
    getVirtualCode(sourceFileId: string, virtualCodeId: string): readonly [VirtualCode<string>, SourceFile] | readonly [undefined, undefined];
};
export declare function updateVirtualCodeMaps(virtualCode: VirtualCode, getSourceSnapshot: (sourceUri: string | undefined) => [string, ts.IScriptSnapshot] | undefined, map?: Map<string, [ts.IScriptSnapshot, SourceMap<CodeInformation>]>): Map<string, [ts.IScriptSnapshot, SourceMap<CodeInformation>]>;
export declare function forEachEmbeddedCode(code: VirtualCode): Generator<VirtualCode>;

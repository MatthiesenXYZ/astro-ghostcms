import type { CodeInformation, VirtualCode } from '@volar/language-core';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { SourceMapWithDocuments } from '../documents';
import type { ServiceContext, ServicePluginInstance, ServicePlugin } from '../types';
export declare function documentFeatureWorker<T>(context: ServiceContext, uri: string, valid: (map: SourceMapWithDocuments<CodeInformation>) => boolean, worker: (service: [ServicePlugin, ServicePluginInstance], document: TextDocument) => Thenable<T | null | undefined> | T | null | undefined, transformResult: (result: T, map?: SourceMapWithDocuments<CodeInformation>) => T | undefined, combineResult?: (results: T[]) => T): Promise<T | undefined>;
export declare function languageFeatureWorker<T, K>(context: ServiceContext, uri: string, getReadDocParams: () => K, eachVirtualDocParams: (map: SourceMapWithDocuments<CodeInformation>) => Generator<K>, worker: (service: [ServicePlugin, ServicePluginInstance], document: TextDocument, params: K, map?: SourceMapWithDocuments<CodeInformation>) => Thenable<T | null | undefined> | T | null | undefined, transformResult: (result: T, map?: SourceMapWithDocuments<CodeInformation>) => T | undefined, combineResult?: (results: T[]) => T): Promise<T | undefined>;
export declare function safeCall<T>(cb: () => Thenable<T> | T, errorMsg?: string): Promise<T | undefined>;
export declare function eachEmbeddedDocument(context: ServiceContext, current: VirtualCode, rootCode?: VirtualCode<string>): Generator<SourceMapWithDocuments<CodeInformation>>;
export declare function getEmbeddedFilesByLevel(context: ServiceContext, sourceFileUri: string, rootFile: VirtualCode, level: number): VirtualCode<string>[];

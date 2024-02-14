import { Diagnostic, LanguagePlugin, ServicePlugin, TypeScriptProjectHost } from '@volar/language-service';
import * as ts from 'typescript';
export declare function createTypeScriptChecker(languages: LanguagePlugin[], services: ServicePlugin[], tsconfig: string): {
    check: (fileName: string) => Promise<Diagnostic[]>;
    fixErrors: (fileName: string, diagnostics: Diagnostic[], only: string[] | undefined, writeFile: (fileName: string, newText: string) => Promise<void>) => Promise<void>;
    printErrors: (fileName: string, diagnostics: Diagnostic[], rootPath?: string) => string;
    languageHost: TypeScriptProjectHost;
    settings: {};
    fileCreated(fileName: string): void;
    fileUpdated(fileName: string): void;
    fileDeleted(fileName: string): void;
};
export declare function createTypeScriptInferredChecker(languages: LanguagePlugin[], services: ServicePlugin[], getScriptFileNames: () => string[], compilerOptions?: ts.CompilerOptions): {
    check: (fileName: string) => Promise<Diagnostic[]>;
    fixErrors: (fileName: string, diagnostics: Diagnostic[], only: string[] | undefined, writeFile: (fileName: string, newText: string) => Promise<void>) => Promise<void>;
    printErrors: (fileName: string, diagnostics: Diagnostic[], rootPath?: string) => string;
    languageHost: TypeScriptProjectHost;
    settings: {};
    fileCreated(fileName: string): void;
    fileUpdated(fileName: string): void;
    fileDeleted(fileName: string): void;
};

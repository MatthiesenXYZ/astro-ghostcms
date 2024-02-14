import type { ServicePlugin } from '@volar/language-service';
import type * as ts from 'typescript';
export * from '@volar/typescript';
export interface Provide {
    'typescript/typescript': () => typeof import('typescript');
    'typescript/languageService': () => ts.LanguageService;
    'typescript/languageServiceHost': () => ts.LanguageServiceHost;
    'typescript/syntacticLanguageService': () => ts.LanguageService;
    'typescript/syntacticLanguageServiceHost': () => ts.LanguageServiceHost;
}
export declare function create(ts: typeof import('typescript')): ServicePlugin;
//# sourceMappingURL=index.d.ts.map
import type * as ts from 'typescript';
import type { SharedContext } from '../types';
export interface IFilePathToResourceConverter {
    /**
     * Convert a typescript filepath to a VS Code resource.
     */
    toResource(filepath: string): string;
}
export declare function plainWithLinks(parts: readonly ts.server.protocol.SymbolDisplayPart[] | string, filePathConverter: IFilePathToResourceConverter, ctx: SharedContext): string;
export declare function tagsMarkdownPreview(tags: readonly ts.JSDocTagInfo[], filePathConverter: IFilePathToResourceConverter, ctx: SharedContext): string;
export declare function markdownDocumentation(documentation: ts.server.protocol.SymbolDisplayPart[] | string | undefined, tags: ts.JSDocTagInfo[] | undefined, filePathConverter: IFilePathToResourceConverter, ctx: SharedContext): string;
export declare function addMarkdownDocumentation(out: string, documentation: ts.server.protocol.SymbolDisplayPart[] | string | undefined, tags: ts.JSDocTagInfo[] | undefined, converter: IFilePathToResourceConverter, ctx: SharedContext): string;
//# sourceMappingURL=previewer.d.ts.map
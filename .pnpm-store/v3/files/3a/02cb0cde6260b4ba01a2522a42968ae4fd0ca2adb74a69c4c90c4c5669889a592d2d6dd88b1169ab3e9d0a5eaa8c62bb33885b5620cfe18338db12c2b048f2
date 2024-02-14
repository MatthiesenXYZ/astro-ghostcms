import type * as vscode from '@volar/language-service';
import type * as ts from 'typescript';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { SharedContext } from '../types';
export declare function entriesToLocations(entries: {
    fileName: string;
    textSpan: ts.TextSpan;
}[], ctx: SharedContext): vscode.Location[];
export declare function entryToLocation(entry: {
    fileName: string;
    textSpan: ts.TextSpan;
}, ctx: SharedContext): vscode.Location | undefined;
export declare function entriesToLocationLinks<T extends ts.DocumentSpan>(entries: T[], ctx: SharedContext): vscode.LocationLink[];
export declare function boundSpanToLocationLinks(info: ts.DefinitionInfoAndBoundSpan, originalDoc: TextDocument, ctx: SharedContext): vscode.LocationLink[];
//# sourceMappingURL=transforms.d.ts.map
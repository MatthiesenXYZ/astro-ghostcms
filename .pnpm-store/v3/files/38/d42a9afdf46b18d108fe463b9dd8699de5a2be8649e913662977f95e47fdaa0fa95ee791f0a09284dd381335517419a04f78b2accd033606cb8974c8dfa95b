import type { AST, Rule } from "eslint";
import type { RuleFixer, SourceCode } from "../types";
import type { TSESTree } from "@typescript-eslint/types";
declare class FixTracker {
    private retainedRange;
    fixer: RuleFixer;
    sourceCode: SourceCode;
    constructor(fixer: RuleFixer, sourceCode: SourceCode);
    private retainRange;
    retainEnclosingFunction(node: TSESTree.Node): this;
    retainSurroundingTokens(nodeOrToken: AST.Token | TSESTree.Token | TSESTree.Node): this;
    private replaceTextRange;
    remove(nodeOrToken: TSESTree.Node | TSESTree.Token | AST.Token): Rule.Fix;
}
export default FixTracker;

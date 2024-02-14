"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_utils_1 = require("./ast-utils");
class FixTracker {
    constructor(fixer, sourceCode) {
        this.fixer = fixer;
        this.sourceCode = sourceCode;
        this.retainedRange = null;
    }
    retainRange(range) {
        this.retainedRange = range;
        return this;
    }
    retainEnclosingFunction(node) {
        const functionNode = (0, ast_utils_1.getUpperFunction)(node);
        return this.retainRange(functionNode ? functionNode.range : this.sourceCode.ast.range);
    }
    retainSurroundingTokens(nodeOrToken) {
        const tokenBefore = this.sourceCode.getTokenBefore(nodeOrToken) || nodeOrToken;
        const tokenAfter = this.sourceCode.getTokenAfter(nodeOrToken) || nodeOrToken;
        return this.retainRange([tokenBefore.range[0], tokenAfter.range[1]]);
    }
    replaceTextRange(range, text) {
        let actualRange;
        if (this.retainedRange) {
            actualRange = [
                Math.min(this.retainedRange[0], range[0]),
                Math.max(this.retainedRange[1], range[1]),
            ];
        }
        else {
            actualRange = range;
        }
        return this.fixer.replaceTextRange(actualRange, this.sourceCode.text.slice(actualRange[0], range[0]) +
            text +
            this.sourceCode.text.slice(range[1], actualRange[1]));
    }
    remove(nodeOrToken) {
        return this.replaceTextRange(nodeOrToken.range, "");
    }
}
exports.default = FixTracker;

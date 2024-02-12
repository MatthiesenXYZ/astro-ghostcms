import * as zod from 'zod';
export class ValidationError extends Error {
    name;
    details;
    constructor(message, options) {
        super(message, options);
        this.name = 'ZodValidationError';
        this.details = getIssuesFromErrorOptions(options);
    }
    toString() {
        return this.message;
    }
}
function getIssuesFromErrorOptions(options) {
    if (options) {
        const cause = options.cause;
        if (cause instanceof zod.ZodError) {
            return cause.issues;
        }
    }
    return [];
}

import { ISSUE_SEPARATOR, MAX_ISSUES_IN_MESSAGE, PREFIX, PREFIX_SEPARATOR, UNION_SEPARATOR, } from './config';
import { getMessageFromZodIssue } from './fromZodIssue';
import { prefixMessage } from './prefixMessage';
import { ValidationError } from './ValidationError';
export function fromZodError(zodError, options = {}) {
    const { maxIssuesInMessage = MAX_ISSUES_IN_MESSAGE, issueSeparator = ISSUE_SEPARATOR, unionSeparator = UNION_SEPARATOR, prefixSeparator = PREFIX_SEPARATOR, prefix = PREFIX, includePath = true, } = options;
    const zodIssues = zodError.errors;
    const reason = zodIssues.length === 0
        ? zodError.message
        : zodIssues
            .slice(0, maxIssuesInMessage)
            .map((issue) => getMessageFromZodIssue({
            issue,
            issueSeparator,
            unionSeparator,
            includePath,
        }))
            .join(issueSeparator);
    const message = prefixMessage(reason, prefix, prefixSeparator);
    return new ValidationError(message, { cause: zodError });
}

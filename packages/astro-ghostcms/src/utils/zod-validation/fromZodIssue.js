import * as zod from "zod";
import { ValidationError } from "./ValidationError";
import {
	ISSUE_SEPARATOR,
	PREFIX,
	PREFIX_SEPARATOR,
	UNION_SEPARATOR,
} from "./config";
import { prefixMessage } from "./prefixMessage";
import { isNonEmptyArray } from "./utils/NonEmptyArray";
import { joinPath } from "./utils/joinPath";
export function getMessageFromZodIssue(props) {
	const { issue, issueSeparator, unionSeparator, includePath } = props;
	if (issue.code === "invalid_union") {
		return issue.unionErrors
			.reduce((acc, zodError) => {
				const newIssues = zodError.issues
					.map((issue) =>
						getMessageFromZodIssue({
							issue,
							issueSeparator,
							unionSeparator,
							includePath,
						}),
					)
					.join(issueSeparator);
				if (!acc.includes(newIssues)) {
					acc.push(newIssues);
				}
				return acc;
			}, [])
			.join(unionSeparator);
	}
	if (includePath && isNonEmptyArray(issue.path)) {
		if (issue.path.length === 1) {
			const identifier = issue.path[0];
			if (typeof identifier === "number") {
				return `${issue.message} at index ${identifier}`;
			}
		}
		return `${issue.message} at "${joinPath(issue.path)}"`;
	}
	return issue.message;
}
export function fromZodIssue(issue, options = {}) {
	const {
		issueSeparator = ISSUE_SEPARATOR,
		unionSeparator = UNION_SEPARATOR,
		prefixSeparator = PREFIX_SEPARATOR,
		prefix = PREFIX,
		includePath = true,
	} = options;
	const reason = getMessageFromZodIssue({
		issue,
		issueSeparator,
		unionSeparator,
		includePath,
	});
	const message = prefixMessage(reason, prefix, prefixSeparator);
	return new ValidationError(message, { cause: new zod.ZodError([issue]) });
}

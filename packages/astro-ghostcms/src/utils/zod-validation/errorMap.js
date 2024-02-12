import { fromZodIssue } from './fromZodIssue';
export const errorMap = (issue, ctx) => {
    const error = fromZodIssue({
        ...issue,
        message: issue.message ?? ctx.defaultError,
    });
    return {
        message: error.message,
    };
};

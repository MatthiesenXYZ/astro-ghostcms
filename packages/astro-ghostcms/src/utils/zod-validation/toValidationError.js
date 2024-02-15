import * as zod from "zod";
import { ValidationError } from "./ValidationError";
import { fromZodError } from "./fromZodError";
export const toValidationError =
	(options = {}) =>
	(err) => {
		if (err instanceof zod.ZodError) {
			return fromZodError(err, options);
		}
		if (err instanceof Error) {
			return new ValidationError(err.message, { cause: err });
		}
		return new ValidationError("Unknown error");
	};

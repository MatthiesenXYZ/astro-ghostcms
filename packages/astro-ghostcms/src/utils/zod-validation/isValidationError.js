import { ValidationError } from './ValidationError';
export function isValidationError(err) {
    return err instanceof ValidationError;
}

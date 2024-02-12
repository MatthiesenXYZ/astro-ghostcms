export function isValidationErrorLike(err) {
    return err instanceof Error && err.name === 'ZodValidationError';
}

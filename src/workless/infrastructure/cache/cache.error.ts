export class CacheBackendUnavailableError extends Error {
  readonly operation: string;
  readonly originalError: unknown;

  constructor(operation: string, originalError: unknown) {
    const message = originalError instanceof Error ? originalError.message : String(originalError);
    super(`Cache backend ${operation} failed: ${message}`);
    this.name = 'CacheBackendUnavailableError';
    this.operation = operation;
    this.originalError = originalError;
  }
}

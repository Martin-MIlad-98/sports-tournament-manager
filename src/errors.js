/** An error that carries an HTTP status, so routes can answer with a clear message. */
export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

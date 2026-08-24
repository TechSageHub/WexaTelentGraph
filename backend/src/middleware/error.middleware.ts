import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  code?: string;
}

/**
 * Centralized error middleware.
 *
 * Catches all errors thrown by controllers/services and returns a consistent
 * JSON error response without leaking internal stack traces or DB credentials.
 */
export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log for internal debugging — never sent to client
  console.error(`[ERROR] ${err.message}`, {
    code: err.code,
    stack: process.env['NODE_ENV'] === 'development' ? err.stack : undefined,
  });

  // Database connectivity errors
  const message = err.message ?? '';
  if (
    message.includes('Connection was refused') ||
    message.includes('Could not perform discovery') ||
    message.includes('ServiceUnavailable') ||
    err.code === 'ServiceUnavailable'
  ) {
    res.status(503).json({
      error: {
        message: 'Unable to connect to the talent database. Please try again in a moment.',
      },
    });
    return;
  }

  // Generic server error — no internal details exposed
  res.status(err.status ?? 500).json({
    error: {
      message: 'An unexpected error occurred. Please try again.',
    },
  });
}

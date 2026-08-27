import { Request, Response, NextFunction } from 'express';

/**
 * Reject requests where a named path param is missing or not a non-empty string.
 * Usage: router.get('/:jobId', validateParams(['jobId']), handler)
 */
export function validateParams(paramNames: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const name of paramNames) {
      const value = req.params[name];
      if (typeof value !== 'string' || value.trim().length === 0) {
        res.status(400).json({
          error: { message: `Invalid or missing path parameter: ${name}` },
        });
        return;
      }
    }
    next();
  };
}

/**
 * @file errorHandler.ts
 * @description Global 4-parameter Express error-handling middleware.
 *
 * LOGIC — Error type waterfall:
 *  1. AppError (isOperational)     → use its statusCode + message directly.
 *  2. Mongoose ValidationError     → 400, collect all field messages.
 *  3. MongoDB duplicate key 11000  → 409, reveal which field duplicated.
 *  4. JWT JsonWebTokenError        → 401.
 *  5. JWT TokenExpiredError        → 401.
 *  6. Joi validation (isJoi)       → 400 (thrown by validate middleware).
 *  7. Fallback                     → 500, hide real message in production.
 *
 * WHY 4 params?
 *  Express identifies error-handling middleware exclusively by arity 4.
 *  Even if `next` is unused, it MUST be declared.
 *
 * WHY hide messages in production (step 7)?
 *  Stack traces and internal messages may leak implementation details
 *  that help attackers. Only operational errors are safe to expose.
 */
import { Request, Response, NextFunction } from 'express';
declare const errorHandler: (err: any, req: Request, res: Response, _next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map
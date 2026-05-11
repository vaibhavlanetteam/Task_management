/**
 * @file auth.middleware.ts
 * @description JWT verification middleware — protects private routes.
 *
 * LOGIC (step by step):
 *  1. Extract the raw token from "Authorization: Bearer <token>" header.
 *     If the header is missing or doesn't start with "Bearer " → 401.
 *  2. Call jwt.verify(token, JWT_SECRET) — synchronous.
 *     - Valid + unexpired  → returns decoded payload object.
 *     - Invalid signature  → throws JsonWebTokenError  → 401 (errorHandler).
 *     - Expired            → throws TokenExpiredError  → 401 (errorHandler).
 *  3. Attach decoded payload to req.user so subsequent route handlers can
 *     use it without re-querying the database:
 *       req.user.id    → used to scope tasks (Task.find({ user: req.user.id }))
 *       req.user.email → useful for audit logs
 *
 * WHY extend Express.Request with req.user?
 *  TypeScript's Request type doesn't know about `user`. We extend it via
 *  declaration merging in a custom type declaration below.
 */
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}
declare const authMiddleware: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export default authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map
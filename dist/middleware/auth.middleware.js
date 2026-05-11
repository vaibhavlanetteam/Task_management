"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../common/AppError"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authMiddleware = async (req, _res, next) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
        return next(new AppError_1.default('No token provided', 401));
    }
    const token = header.split(' ')[1];
    try {
        // LOGIC: payload.sub is expected as the user ID
        const payload = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        // Fetch user from DB and attach to req.user
        const user = await user_model_1.default.findById(payload.sub).select('-passwordHash');
        if (!user) {
            return next(new AppError_1.default('User not found', 401));
        }
        // Attach full Mongoose document (minus hash) to req.user
        req.user = user;
        next();
    }
    catch (error) {
        next(new AppError_1.default('Invalid or expired token', 401));
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map
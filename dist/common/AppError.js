"use strict";
/**
 * @file AppError.ts
 * @description Custom operational error class.
 *
 * LOGIC:
 *  - Extends the built-in Error so it can be throw-ed and caught normally.
 *  - Adds a numeric `statusCode` (HTTP status) and `isOperational` flag.
 *  - isOperational = true  → predictable user-facing error (400, 401, 404…)
 *  - isOperational = false → programming bug; default Error instances will
 *    have isOperational undefined/false so errorHandler can distinguish them.
 *
 * WHY distinguish operational vs programmer errors?
 *  In production you'd send a generic "Internal Server Error" for programmer
 *  errors and keep the real message for operational ones. The errorHandler
 *  uses isOperational to decide which message to expose.
 *
 * USAGE:
 *   throw new AppError('Email already registered', 409);
 *   throw new AppError('Task not found', 404);
 */
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        // Captures the stack trace, excluding AppError constructor itself
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
//# sourceMappingURL=AppError.js.map
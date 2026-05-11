"use strict";
/**
 * @file auth.validation.ts
 * @description Joi schemas for auth endpoints.
 *
 * registerSchema:
 *  name     → string, trimmed, required
 *  email    → valid email format, required
 *  password → min 8 chars, required (Joi validates; bcrypt hashes in service)
 *
 * loginSchema:
 *  email    → valid email, required
 *  password → required (length intentionally NOT re-checked; wrong pw = 401)
 *
 * LOGIC:
 *  These schemas are consumed by validate() middleware placed on each route.
 *  Joi returns clear error messages that are forwarded as AppError(msg, 400).
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        'any.required': 'Name is required',
        'string.empty': 'Name cannot be empty',
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
    }),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required',
    }),
});
//# sourceMappingURL=auth.validation.js.map
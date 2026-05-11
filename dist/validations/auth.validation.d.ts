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
import Joi from 'joi';
export declare const registerSchema: Joi.ObjectSchema<any>;
export declare const loginSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=auth.validation.d.ts.map
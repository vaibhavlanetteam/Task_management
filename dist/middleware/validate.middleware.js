"use strict";
/**
 * @file validate.middleware.ts
 * @description Reusable Joi validation middleware factory.
 *
 * LOGIC:
 *  validate(schema, target) returns an Express middleware that:
 *    1. Calls schema.validate(req[target], options).
 *       - abortEarly: false  → collect ALL errors, not just first.
 *       - stripUnknown: true → silently drop fields not in schema
 *                             (prevents extra data reaching the DB).
 *    2. On Joi error: join all detail messages into one string and
 *       forward a new AppError(msg, 400) to the global errorHandler.
 *    3. On success: replace req[target] with the sanitised + type-cast
 *       "value" returned by Joi (e.g. "medium" default filled in,
 *       date strings converted to Date objects, etc.) then call next().
 *
 * USAGE:
 *   router.post('/tasks', validate(createTaskSchema), tasksController.create);
 *   router.get('/tasks',  validate(taskFiltersSchema, 'query'), tasksController.findAll);
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../common/AppError"));
const validate = (schema, target = 'body') => (req, _res, next) => {
    const { error, value } = schema.validate(req[target], {
        abortEarly: false, // collect ALL errors
        stripUnknown: true, // remove unknown fields
    });
    if (error) {
        // Join every Joi detail message into a single, readable string
        const msg = error.details.map((d) => d.message).join(', ');
        return next(new AppError_1.default(msg, 400));
    }
    // Replace with Joi-sanitised & type-cast value
    req[target] = value;
    next();
};
exports.default = validate;
//# sourceMappingURL=validate.middleware.js.map
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
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
type Target = 'body' | 'query' | 'params';
declare const validate: (schema: Schema, target?: Target) => (req: Request, _res: Response, next: NextFunction) => void;
export default validate;
//# sourceMappingURL=validate.middleware.d.ts.map
/**
 * @file task.validation.ts
 * @description Joi schemas for task CRUD and query filtering.
 *
 * createTaskSchema:
 *  title, description, priority, status, dueDate (ISO), tags[]
 *
 * updateTaskSchema (PartialType equivalent):
 *  All fields optional, BUT .min(1) requires at least one field → prevents
 *  empty PATCH requests that do nothing.
 *
 * taskFiltersSchema (for GET /tasks query params):
 *  status, priority, search, page (≥1, default 1), limit (1-100, default 10)
 *  LOGIC: Joi coerces query-string numbers:
 *    "?page=2" → page becomes the number 2 (not string "2")
 *  This avoids manual parseInt() in every controller.
 */
import Joi from 'joi';
export declare const createTaskSchema: Joi.ObjectSchema<any>;
export declare const updateTaskSchema: Joi.ObjectSchema<any>;
export declare const taskFiltersSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=task.validation.d.ts.map
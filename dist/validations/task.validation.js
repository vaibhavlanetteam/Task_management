"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskFiltersSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['todo', 'in-progress', 'done'];
exports.createTaskSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(200).required().messages({
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required',
    }),
    description: joi_1.default.string().required().messages({
        'any.required': 'Description is required',
    }),
    priority: joi_1.default.string()
        .valid(...PRIORITIES)
        .default('medium')
        .messages({ 'any.only': 'Priority must be: low, medium, or high' }),
    status: joi_1.default.string()
        .valid(...STATUSES)
        .default('todo')
        .messages({ 'any.only': 'Status must be: todo, in-progress, or done' }),
    // LOGIC: Joi.date().iso() accepts ISO-8601 strings AND converts them to
    //        native Date objects before they reach the service/model layer.
    dueDate: joi_1.default.date().iso().required().messages({
        'date.format': 'dueDate must be a valid ISO 8601 date (e.g. 2025-12-31)',
        'any.required': 'dueDate is required',
    }),
    tags: joi_1.default.array().items(joi_1.default.string()).default([]),
});
// ── Partial update — all fields optional, at least 1 required ──────────────
exports.updateTaskSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(200),
    description: joi_1.default.string(),
    priority: joi_1.default.string().valid(...PRIORITIES),
    status: joi_1.default.string().valid(...STATUSES),
    dueDate: joi_1.default.date().iso(),
    tags: joi_1.default.array().items(joi_1.default.string()),
}).min(1); // LOGIC: .min(1) = at least one key must be present — prevents empty PATCH
// ── Query param filters for GET /tasks ─────────────────────────────────────
exports.taskFiltersSchema = joi_1.default.object({
    status: joi_1.default.string().valid(...STATUSES),
    priority: joi_1.default.string().valid(...PRIORITIES),
    search: joi_1.default.string().allow(''),
    // LOGIC: Joi.number() coerces the query-string "2" → 2 automatically
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
});
//# sourceMappingURL=task.validation.js.map
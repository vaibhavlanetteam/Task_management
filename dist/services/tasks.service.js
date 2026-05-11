"use strict";
/**
 * @file tasks.service.ts
 * @description Business logic for Task CRUD operations.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ findAll(userId, filters)                                        │
 * │  Builds a dynamic MongoDB query object from optional filters:   │
 * │    status   → exact match                                       │
 * │    priority → exact match                                       │
 * │    search   → case-insensitive regex on title OR description    │
 * │  Applies pagination via .skip() and .limit().                   │
 * │  Returns { tasks, total, page, limit, totalPages }.             │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ findOne(taskId, userId)                                         │
 * │  Finds task by id AND user — enforces ownership.                │
 * │  If not found or belongs to another user → 404 (not 403, to    │
 * │  prevent enumeration of other users' task IDs).                 │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ create(userId, dto)                                             │
 * │  Creates task with user = userId (from JWT payload).            │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ update(taskId, userId, dto)                                     │
 * │  findOne first (ownership check) then apply partial update via  │
 * │  Object.assign + save() so pre-save hooks run if any added.     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ remove(taskId, userId)                                          │
 * │  findOne (ownership check) then deleteOne().                    │
 * └─────────────────────────────────────────────────────────────────┘
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.findOne = exports.findAll = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const AppError_1 = __importDefault(require("../common/AppError"));
// ─────────────────────────────────────────────────────────────────────────────
const findAll = async (userId, filters) => {
    const { status, priority, search, page, limit } = filters;
    // ── Build dynamic query ─────────────────────────────────────────────────
    // LOGIC: We always filter by owner (user). Additional filters are added
    //        only when the client provides them; otherwise they are ignored.
    const query = { user: userId };
    if (status)
        query.status = status;
    if (priority)
        query.priority = priority;
    // LOGIC: $or with $regex lets us search across title AND description.
    //        'i' flag → case-insensitive so "TASK" matches "task".
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    // ── Pagination ─────────────────────────────────────────────────────────
    // LOGIC: skip() = (page - 1) * limit, e.g. page=2, limit=10 → skip 10
    const skip = (page - 1) * limit;
    const total = await task_model_1.default.countDocuments(query);
    const tasks = await task_model_1.default
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // LOGIC: Use .lean() for read-only query performance
    return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.findAll = findAll;
// ─────────────────────────────────────────────────────────────────────────────
const findOne = async (id, userId) => {
    const task = await task_model_1.default.findById(id);
    if (!task)
        throw new AppError_1.default('Task not found', 404);
    // LOGIC: Specific ownership check using toString() as requested
    if (task.user.toString() !== userId.toString()) {
        throw new AppError_1.default('Forbidden', 403);
    }
    return task;
};
exports.findOne = findOne;
// ─────────────────────────────────────────────────────────────────────────────
const create = async (taskData, userId) => {
    return task_model_1.default.create({ ...taskData, user: userId });
};
exports.create = create;
// ─────────────────────────────────────────────────────────────────────────────
const update = async (id, updateData, userId) => {
    // Ownership check pattern reused as requested
    const task = await (0, exports.findOne)(id, userId);
    // LOGIC: findByIdAndUpdate with { new: true } as requested
    const updatedTask = await task_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTask)
        throw new AppError_1.default('Task not found', 404);
    return updatedTask;
};
exports.update = update;
// ─────────────────────────────────────────────────────────────────────────────
const remove = async (id, userId) => {
    // Ownership check
    await (0, exports.findOne)(id, userId);
    await task_model_1.default.findByIdAndDelete(id);
};
exports.remove = remove;
//# sourceMappingURL=tasks.service.js.map
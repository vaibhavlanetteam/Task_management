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
import { ITask } from '../models/task.model';
interface TaskFilters {
    status?: string;
    priority?: string;
    search?: string;
    page: number;
    limit: number;
}
interface PaginatedTasks {
    tasks: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare const findAll: (userId: string, filters: TaskFilters) => Promise<PaginatedTasks>;
export declare const findOne: (id: string, userId: string) => Promise<ITask>;
export declare const create: (taskData: Partial<ITask>, userId: string) => Promise<ITask>;
export declare const update: (id: string, updateData: Partial<ITask>, userId: string) => Promise<ITask>;
export declare const remove: (id: string, userId: string) => Promise<void>;
export {};
//# sourceMappingURL=tasks.service.d.ts.map
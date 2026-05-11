/**
 * @file task.model.ts
 * @description Mongoose schema & model for the Task collection.
 *
 * FIELDS:
 *  title       – short label (max 200 chars)
 *  description – detailed text (required)
 *  priority    – low | medium | high  (enum, default: medium)
 *  status      – todo | in-progress | done  (enum, default: todo)
 *  dueDate     – deadline (required, stored as Date)
 *  tags        – string array for labels/categories (default: [])
 *  user        – ObjectId FK → User collection; who owns this task
 *  timestamps  – createdAt, updatedAt auto-managed by Mongoose
 *
 * LOGIC — INDEXES:
 *  { user, status }  – compound index for "get all TODO tasks of user X"
 *  { user, dueDate } – compound index for "tasks due soon for user X"
 *  These prevent full collection-scans (COLLSCAN) on common filter combos.
 *
 * LOGIC — enum validation:
 *  Mongoose enum at schema level is a second safety net. Joi enforces the
 *  same rules at the HTTP boundary (before data ever hits the DB layer).
 */
import mongoose, { Document, Model } from 'mongoose';
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export interface ITask extends Document {
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    dueDate: Date;
    tags: string[];
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Task: Model<ITask>;
export default Task;
//# sourceMappingURL=task.model.d.ts.map
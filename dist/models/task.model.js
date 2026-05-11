"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['todo', 'in-progress', 'done'];
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: PRIORITIES,
        default: 'medium',
    },
    status: {
        type: String,
        enum: STATUSES,
        default: 'todo',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    // ── Foreign key ─────────────────────────────────────────────────────────
    // LOGIC: ObjectId + ref:'User' enables .populate('user') to join data
    // in one extra Mongoose round-trip when needed.
    // In controllers we set: user = req.user.id (from JWT payload).
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
// ── Compound indexes for common query patterns ──────────────────────────────
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
const Task = mongoose_1.default.model('Task', taskSchema);
exports.default = Task;
//# sourceMappingURL=task.model.js.map
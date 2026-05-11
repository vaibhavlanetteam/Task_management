"use strict";
/**
 * @file tasks.controller.ts
 * @description Controller for Task CRUD operations.
 *
 * Handlers:
 *  - create: POST /tasks
 *  - findAll: GET /tasks (with filters and pagination)
 *  - findOne: GET /tasks/:id
 *  - update: PATCH /tasks/:id
 *  - remove: DELETE /tasks/:id
 *
 * LOGIC:
 *  - Scopes all operations to the authenticated user (req.user.id).
 *  - Services handle the actual DB logic and ownership checks.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findOne = exports.findAll = exports.create = void 0;
const tasksService = __importStar(require("../services/tasks.service"));
const create = async (req, res) => {
    // user information is added by authMiddleware to req.user
    const userId = req.user.id;
    const task = await tasksService.create(req.body, userId);
    res.status(201).json(task);
};
exports.create = create;
const findAll = async (req, res) => {
    const userId = req.user.id;
    // req.query is validated and type-cast by validateMiddleware
    const { tasks, total, page, limit } = await tasksService.findAll(userId, req.query);
    res.status(200).json({
        data: tasks,
        total,
        page,
        limit,
    });
};
exports.findAll = findAll;
const findOne = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await tasksService.findOne(id, userId);
    res.status(200).json(task);
};
exports.findOne = findOne;
const update = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await tasksService.update(id, req.body, userId);
    res.status(200).json(task);
};
exports.update = update;
const remove = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    await tasksService.remove(id, userId);
    res.status(200).json({ message: 'Task deleted successfully' });
};
exports.remove = remove;
//# sourceMappingURL=tasks.controller.js.map
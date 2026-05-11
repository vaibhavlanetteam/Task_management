"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const task_model_1 = __importDefault(require("../../models/task.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const tasksService = __importStar(require("../tasks.service"));
let mongo;
let userId;
let otherUserId;
beforeAll(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose_1.default.connect(uri);
    const user = await user_model_1.default.create({ name: 'User', email: 'u1@ex.com', passwordHash: 'h' });
    const other = await user_model_1.default.create({ name: 'Other', email: 'u2@ex.com', passwordHash: 'h' });
    userId = user._id.toString();
    otherUserId = other._id.toString();
});
afterAll(async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongo.stop();
});
describe('TasksService Unit Tests', () => {
    let taskId;
    test('create - should create a task', async () => {
        const data = {
            title: 'Test Task',
            description: 'Desc',
            dueDate: new Date(),
        };
        const task = await tasksService.create(data, userId);
        expect(task.title).toBe(data.title);
        expect(task.user.toString()).toBe(userId);
        taskId = task._id.toString();
    });
    test('findAll - should return paginated tasks for user', async () => {
        const result = await tasksService.findAll(userId, { page: 1, limit: 10 });
        expect(result.tasks).toHaveLength(1);
        expect(result.total).toBe(1);
    });
    test('findOne - should return task by ID', async () => {
        const task = await tasksService.findOne(taskId, userId);
        expect(task._id.toString()).toBe(taskId);
    });
    test('findOne - should throw 404 if missing', async () => {
        const fakeId = new mongoose_1.default.Types.ObjectId().toString();
        await expect(tasksService.findOne(fakeId, userId)).rejects.toHaveProperty('statusCode', 404);
    });
    test('findOne - should throw 403 if wrong owner', async () => {
        await expect(tasksService.findOne(taskId, otherUserId)).rejects.toHaveProperty('statusCode', 403);
    });
    test('remove - should throw 403 for ownership violation', async () => {
        await expect(tasksService.remove(taskId, otherUserId)).rejects.toHaveProperty('statusCode', 403);
    });
    test('remove - should delete task', async () => {
        await tasksService.remove(taskId, userId);
        const found = await task_model_1.default.findById(taskId);
        expect(found).toBeNull();
    });
});
//# sourceMappingURL=tasks.service.test.js.map
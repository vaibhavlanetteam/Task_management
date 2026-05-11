import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from '../../models/task.model';
import User from '../../models/user.model';
import * as tasksService from '../tasks.service';
import AppError from '../../common/AppError';

let mongo: MongoMemoryServer;
let userId: string;
let otherUserId: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  const user = await User.create({ name: 'User', email: 'u1@ex.com', passwordHash: 'h' });
  const other = await User.create({ name: 'Other', email: 'u2@ex.com', passwordHash: 'h' });
  userId = user._id.toString();
  otherUserId = other._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('TasksService Unit Tests', () => {
  let taskId: string;

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
    const fakeId = new mongoose.Types.ObjectId().toString();
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
    const found = await Task.findById(taskId);
    expect(found).toBeNull();
  });
});

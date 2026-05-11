import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('E2E Tests', () => {
  let token: string;
  let taskId: string;

  const user = {
    name: 'E2E User',
    email: 'e2e@example.com',
    password: 'password123',
  };

  test('POST /auth/register → 201', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(user);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(user.email);
  });

  test('POST /auth/login → 200 { access_token }', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: user.email, password: user.password });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    token = res.body.access_token;
  });

  test('POST /tasks → 201', async () => {
    const task = {
      title: 'E2E Task',
      description: 'Test E2E Description',
      dueDate: new Date().toISOString(),
      priority: 'high',
    };

    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(task);
    
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(task.title);
    taskId = res.body.id;
  });

  test('GET /tasks → 200 with paginated shape', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('DELETE /tasks/:id → 200', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });
});

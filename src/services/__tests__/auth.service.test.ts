import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/user.model';
import * as authService from '../auth.service';
import AppError from '../../common/AppError';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('AuthService Unit Tests', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  test('register - should hash password and save user', async () => {
    const user = await authService.register(userData);
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    const found = await User.findOne({ email: userData.email }).select('+passwordHash');
    expect(found?.passwordHash).not.toBe(userData.password);
  });

  test('register - should throw 409 for duplicate email', async () => {
    await expect(authService.register(userData)).rejects.toThrow(AppError);
    await expect(authService.register(userData)).rejects.toHaveProperty('statusCode', 409);
  });

  test('login - should return access_token for valid credentials', async () => {
    const result = await authService.login({
      email: userData.email,
      password: userData.password,
    });
    expect(result).toHaveProperty('access_token');
  });

  test('login - should throw 401 for invalid password', async () => {
    await expect(authService.login({
      email: userData.email,
      password: 'wrongpassword',
    })).rejects.toThrow(AppError);
    await expect(authService.login({
      email: userData.email,
      password: 'wrongpassword',
    })).rejects.toHaveProperty('statusCode', 401);
  });
});

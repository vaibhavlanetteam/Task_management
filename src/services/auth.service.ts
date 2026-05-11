import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';
import AppError from '../common/AppError';

const signToken = (user: IUser): string =>
  jwt.sign(
    { sub: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

export const register = async (data: { name: string, email: string, password: string }): Promise<IUser> => {
  const { name, email, password } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  return user;
};

export const validateUser = async (email: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return null;

  return user;
};

export const login = async (data: { email: string, password: string }): Promise<{ access_token: string }> => {
  const { email, password } = data;
  
  const user = await validateUser(email, password);
  
  if (!user) throw new AppError('Invalid credentials', 401);

  const token = signToken(user);

  return { access_token: token };
};

export const getMe = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

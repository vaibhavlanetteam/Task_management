
import dotenv from 'dotenv';
dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
};

export const PORT       = process.env.PORT || '5000';
export const MONGO_URI  = required('MONGO_URI');
export const JWT_SECRET = required('JWT_SECRET');
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const NODE_ENV   = process.env.NODE_ENV || 'development';

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import AppError from '../common/AppError';
import User, { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization || '';
  
  if (!header.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const user = await User.findById(payload.sub).select('-passwordHash');
    
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export default authMiddleware;

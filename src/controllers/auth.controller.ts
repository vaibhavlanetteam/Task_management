import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  
  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  });
};

export const login = async (req: Request, res: Response) => {
  const data = await authService.login(req.body);
  res.status(200).json(data);
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await authService.getMe(userId);
  res.status(200).json(user);
};

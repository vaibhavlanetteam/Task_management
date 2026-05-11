import { Request, Response } from 'express';
import * as tasksService from '../services/tasks.service';
import { TaskFilters } from '../services/tasks.service';

export const create = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const task = await tasksService.create(req.body, userId);
  res.status(201).json(task);
};

export const findAll = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const filters = req.query as unknown as TaskFilters;
  const { tasks, total, page, limit } = await tasksService.findAll(userId, filters);
  res.status(200).json({
    data: tasks,
    total,
    page,
    limit,
  });
};

export const findOne = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const task = await tasksService.findOne(id as string, userId);
  res.status(200).json(task);
};

export const update = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const task = await tasksService.update(id as string, req.body, userId);
  res.status(200).json(task);
};

export const remove = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  await tasksService.remove(id as string, userId);
  res.status(200).json({ message: 'Task deleted successfully' });
};

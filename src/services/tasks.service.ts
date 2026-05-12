import mongoose from 'mongoose';
import Task, { ITask } from '../models/task.model';
import AppError from '../common/AppError';

export interface TaskFilters {
  status?:   string;
  priority?: string;
  search?:   string;
  page:      number;
  limit:     number;
}

interface LeanTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date;
  tags: string[];
  user: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedTasks {
  tasks:      LeanTask[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export const findAll = async (
  userId: string,
  filters: TaskFilters
): Promise<PaginatedTasks> => {

  const { status, priority, search, page, limit } = filters;

  const query: Record<string, unknown> = { user: userId };

  if (status)   query.status   = status;
  if (priority) query.priority = priority;

  if (search) {
    query.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip  = (page - 1) * limit;
  const total = await Task.countDocuments(query);

  const tasks = await Task
    .find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean() as unknown as LeanTask[]; 

  return {
    tasks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const findOne = async (id: string, userId: string): Promise<ITask> => {
  const task = await Task.findOne({ _id: id, user: userId }).populate('user', 'name email');
  
  if (!task) {
    const exists = await Task.exists({ _id: id });
    if (exists) throw new AppError('Forbidden', 403);
    throw new AppError('Task not found', 404);
  }
  
  return task;
};

export const create = async (
  taskData: Partial<ITask>,
  userId: string
): Promise<ITask> => {
  const task = await Task.create({ ...taskData, user: userId });
  return task.populate('user', 'name email');
};

export const update = async (
  id: string,
  updateData: Partial<ITask>,
  userId: string
): Promise<ITask> => {
  await findOne(id, userId);

  const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
  
  if (!updatedTask) throw new AppError('Task not found', 404);
  return updatedTask;
};

export const remove = async (id: string, userId: string): Promise<void> => {
  await findOne(id, userId);
  await Task.findByIdAndDelete(id);
};

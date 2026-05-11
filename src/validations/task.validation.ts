import Joi from 'joi';

const PRIORITIES = ['low', 'medium', 'high'] as const;
const STATUSES   = ['todo', 'in-progress', 'done'] as const;

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required',
  }),

  description: Joi.string().required().messages({
    'any.required': 'Description is required',
  }),

  priority: Joi.string()
    .valid(...PRIORITIES)
    .default('medium')
    .messages({ 'any.only': 'Priority must be: low, medium, or high' }),

  status: Joi.string()
    .valid(...STATUSES)
    .default('todo')
    .messages({ 'any.only': 'Status must be: todo, in-progress, or done' }),

  dueDate: Joi.date().iso().required().messages({
    'date.format': 'dueDate must be a valid ISO 8601 date (e.g. 2025-12-31)',
    'any.required': 'dueDate is required',
  }),

  tags: Joi.array().items(Joi.string()).default([]),
});


export const updateTaskSchema = Joi.object({
  title:       Joi.string().trim().max(200),
  description: Joi.string(),
  priority:    Joi.string().valid(...PRIORITIES),
  status:      Joi.string().valid(...STATUSES),
  dueDate:     Joi.date().iso(),
  tags:        Joi.array().items(Joi.string()),
}).min(1); 

export const taskFiltersSchema = Joi.object({
  status:   Joi.string().valid(...STATUSES),
  priority: Joi.string().valid(...PRIORITIES),
  search:   Joi.string().allow(''),
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

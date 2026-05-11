import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import AppError from '../common/AppError';

type Target = 'body' | 'query' | 'params';

const validate =
  (schema: Schema, target: Target = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {

    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,  
    });

    if (error) {
      const msg = error.details.map((d) => d.message).join(', ');
      return next(new AppError(msg, 400));
    }

    if (target === 'body') req.body = value;
    if (target === 'query') req.query = value;
    if (target === 'params') req.params = value;
    
    next();
  };

export default validate;

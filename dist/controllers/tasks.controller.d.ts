/**
 * @file tasks.controller.ts
 * @description Controller for Task CRUD operations.
 *
 * Handlers:
 *  - create: POST /tasks
 *  - findAll: GET /tasks (with filters and pagination)
 *  - findOne: GET /tasks/:id
 *  - update: PATCH /tasks/:id
 *  - remove: DELETE /tasks/:id
 *
 * LOGIC:
 *  - Scopes all operations to the authenticated user (req.user.id).
 *  - Services handle the actual DB logic and ownership checks.
 */
import { Request, Response } from 'express';
export declare const create: (req: Request, res: Response) => Promise<void>;
export declare const findAll: (req: Request, res: Response) => Promise<void>;
export declare const findOne: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<void>;
export declare const remove: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=tasks.controller.d.ts.map
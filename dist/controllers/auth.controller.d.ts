/**
 * @file auth.controller.ts
 * @description Controller for authentication routes.
 *
 * Handlers:
 *  - register: Calls authService.register to create a user and get a JWT.
 *  - login: Calls authService.login to verify credentials and get a JWT.
 *  - getMe: Calls authService.getMe to fetch current user profile.
 *
 * LOGIC:
 *  - Relies on express-async-errors (or similar) to catch rejected promises
 *    from services and pass them to the global errorHandler.
 *  - Handlers focus on extracting data from req and sending standardized JSON.
 */
import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map
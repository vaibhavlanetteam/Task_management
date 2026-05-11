/**
 * @file auth.service.ts
 * @description Business logic for authentication (register, login, getMe).
 *
 * WHY a service layer?
 *  Controllers should only handle HTTP concerns (reading req, sending res).
 *  All DB queries, password hashing, and JWT signing live here so:
 *    - Logic is reusable and testable without Express.
 *    - Controllers stay thin and easy to read.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ register(name, email, password)                             │
 * │  1. Check duplicate email → AppError 409 if taken.         │
 * │  2. Hash the plain-text password with bcrypt (saltRounds=10)│
 * │     LOGIC: saltRounds=10 means bcrypt runs 2^10 = 1024     │
 * │     iterations. Each extra round doubles cracking time.     │
 * │  3. Create user with passwordHash stored in DB.             │
 * │  4. Sign & return JWT.                                      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ login(email, password)                                      │
 * │  1. Find user by email (case-insensitive due to lowercase:  │
 * │     true in schema).                                        │
 * │  2. If not found → generic 401 (no user enumeration).      │
 * │  3. bcrypt.compare(candidate, hash) → timing-safe compare. │
 * │  4. If mismatch → same generic 401.                         │
 * │  5. Sign & return JWT.                                      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ getMe(userId)                                               │
 * │  Fetch the current user by id (used in GET /auth/me).      │
 * └─────────────────────────────────────────────────────────────┘
 */
import { IUser } from '../models/user.model';
export declare const register: (data: {
    name: string;
    email: string;
    password: string;
}) => Promise<IUser>;
/**
 * @description Validates user by email and password hash.
 * @returns User object if valid, null otherwise.
 */
export declare const validateUser: (email: string, password: string) => Promise<IUser | null>;
export declare const login: (data: {
    email: string;
    password: string;
}) => Promise<{
    access_token: string;
}>;
export declare const getMe: (userId: string) => Promise<IUser>;
//# sourceMappingURL=auth.service.d.ts.map
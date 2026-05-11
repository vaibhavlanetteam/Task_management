"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.validateUser = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../common/AppError"));
// ── Helper: sign JWT ────────────────────────────────────────────────────────
// LOGIC: Use 'sub' (subject) for user ID as per standard JWT practices and middleware expectation.
const signToken = (user) => jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, env_1.JWT_SECRET, { expiresIn: env_1.JWT_EXPIRES_IN });
// ─────────────────────────────────────────────────────────────────────────────
const register = async (data) => {
    const { name, email, password } = data;
    const existing = await user_model_1.default.findOne({ email });
    if (existing)
        throw new AppError_1.default('Email already registered', 409);
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await user_model_1.default.create({ name, email, passwordHash });
    return user;
};
exports.register = register;
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @description Validates user by email and password hash.
 * @returns User object if valid, null otherwise.
 */
const validateUser = async (email, password) => {
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        return null;
    const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isMatch)
        return null;
    return user;
};
exports.validateUser = validateUser;
// ─────────────────────────────────────────────────────────────────────────────
const login = async (data) => {
    const { email, password } = data;
    const user = await (0, exports.validateUser)(email, password);
    if (!user)
        throw new AppError_1.default('Invalid credentials', 401);
    const token = signToken(user);
    return { access_token: token };
};
exports.login = login;
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (userId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new AppError_1.default('User not found', 404);
    return user;
};
exports.getMe = getMe;
//# sourceMappingURL=auth.service.js.map
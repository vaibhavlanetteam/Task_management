"use strict";
/**
 * @file env.ts
 * @description Central place to read + export all environment variables.
 *
 * LOGIC:
 *  - dotenv.config() reads .env into process.env ONCE at startup.
 *  - We export typed constants so no raw process.env strings are
 *    scattered around — every other file imports from here.
 *  - If a required variable is missing we throw early (fail-fast) so
 *    the server never starts with a broken config.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required env variable: ${key}`);
    return value;
};
exports.PORT = process.env.PORT || '5000';
exports.MONGO_URI = required('MONGO_URI');
exports.JWT_SECRET = required('JWT_SECRET');
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
exports.NODE_ENV = process.env.NODE_ENV || 'development';
//# sourceMappingURL=env.js.map
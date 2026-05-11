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
export declare const PORT: string;
export declare const MONGO_URI: string;
export declare const JWT_SECRET: string;
export declare const JWT_EXPIRES_IN: string;
export declare const NODE_ENV: string;
//# sourceMappingURL=env.d.ts.map
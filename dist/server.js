"use strict";
/**
 * @file server.ts
 * @description Entry point for the Node.js / TypeScript server.
 *
 * LOGIC:
 *  1. Connect to MongoDB.
 *  2. If DB connection fails, exit process.
 *  3. Start the Express server on the specified PORT.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = require("./config/env");
const startServer = async () => {
    try {
        // 1. Establish Database Connection
        await (0, db_1.default)();
        // 2. Start HTTP Server
        app_1.default.listen(env_1.PORT, () => {
            console.log(`🚀  Server running on http://localhost:${env_1.PORT}`);
            console.log(`📜  Swagger docs available at http://localhost:${env_1.PORT}/api/docs`);
        });
    }
    catch (error) {
        console.error('❌  Failed to start server:', error);
        process.exit(1); // Exit with failure code
    }
};
startServer();
//# sourceMappingURL=server.js.map
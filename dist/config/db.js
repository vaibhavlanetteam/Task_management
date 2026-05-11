"use strict";
/**
 * @file db.ts
 * @description Establishes a Mongoose connection to MongoDB.
 *
 * LOGIC:
 *  - Called once from server.ts before app.listen().
 *  - If MONGO_URI is wrong or MongoDB is down, the thrown error
 *    propagates to server.ts which logs & exits the process (fail-fast).
 *  - We use the MONGO_URI exported from config/env.ts so there are
 *    no raw process.env reads outside of config/.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    const conn = await mongoose_1.default.connect(env_1.MONGO_URI);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map
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
declare const connectDB: () => Promise<void>;
export default connectDB;
//# sourceMappingURL=db.d.ts.map
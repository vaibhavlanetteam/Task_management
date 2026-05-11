"use strict";
/**
 * @file app.ts
 * @description Main Express application setup.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const errorHandler_1 = __importDefault(require("./common/errorHandler"));
const AppError_1 = __importDefault(require("./common/AppError"));
const app = (0, express_1.default)();
// MIDDLEWARE
app.use((0, morgan_1.default)('dev')); // Logging
app.use(express_1.default.json());
// RATE LIMITING
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
});
app.use('/api/', limiter);
// SWAGGER CONFIGURATION
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Task Management API', version: '1.0.0' },
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'], // scan all route files for @swagger JSDoc blocks
});
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// ROUTES
app.use('/api/auth', auth_routes_1.default);
app.use('/api/tasks', tasks_routes_1.default);
// 404 HANDLER
app.use('*', (req, res, next) => {
    next(new AppError_1.default(`Route not found: ${req.originalUrl}`, 404));
});
// GLOBAL ERROR HANDLER
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map
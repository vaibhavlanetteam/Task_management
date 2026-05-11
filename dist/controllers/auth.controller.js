"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/auth.service"));
const register = async (req, res) => {
    const user = await authService.register(req.body);
    // Return specific fields: id, name, email, createdAt
    res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    });
};
exports.register = register;
const login = async (req, res) => {
    const data = await authService.login(req.body);
    res.status(200).json(data); // Returns { access_token: string }
};
exports.login = login;
const getMe = async (req, res) => {
    const userId = req.user.id;
    const user = await authService.getMe(userId);
    res.status(200).json(user);
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map
"use strict";
/**
 * @file user.model.ts
 * @description Mongoose schema & model for the User collection.
 *
 * FIELDS:
 *  name         – display name, trimmed
 *  email        – unique, lowercased (index → fast look-ups in login)
 *  passwordHash – bcryptjs hash; stripped from every JSON response via toJSON()
 *  timestamps   – createdAt & updatedAt managed by Mongoose
 *
 * LOGIC — toJSON():
 *  We override the instance toJSON method so that every time Mongoose
 *  serialises a User (res.json(user), JSON.stringify(user) etc.) the
 *  passwordHash field is automatically deleted from the plain object.
 *  This means controllers NEVER accidentally leak the hash.
 *
 * WHY store passwordHash not password?
 *  The field name makes it 100 % clear the value is already hashed —
 *  no future developer will mistakenly store/compare plain text.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // MongoDB unique index — fast O(log n) lookups
        lowercase: true, // normalise before storage
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
}, { timestamps: true } // adds createdAt + updatedAt automatically
);
// ── Strip passwordHash from every JSON response ─────────────────────────────
// LOGIC: toJSON() is called by JSON.stringify() (and thus by Express res.json).
//        We convert to a plain object and delete the sensitive field before
//        returning. Callers get clean user objects with no hash exposed.
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id; // Add 'id' field
    delete obj._id; // Remove '_id'
    delete obj.__v; // Remove version key
    delete obj.passwordHash;
    return obj;
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map
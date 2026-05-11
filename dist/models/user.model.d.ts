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
import { Document, Model } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=user.model.d.ts.map
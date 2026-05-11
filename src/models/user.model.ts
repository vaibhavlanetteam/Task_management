import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,      
      lowercase: true,   
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }  
);
userSchema.methods.toJSON = function () {
  const obj = this.toObject() as Record<string, unknown>;
  obj.id = (obj._id as mongoose.Types.ObjectId).toString();
  delete obj._id;
  delete obj.__v;
  delete obj.passwordHash;
  return obj;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;

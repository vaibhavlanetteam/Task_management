
import mongoose from 'mongoose';
import { MONGO_URI } from './env';

const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
};

export default connectDB;

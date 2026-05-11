import mongoose, { Document, Model } from 'mongoose';

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

const PRIORITIES: Priority[]   = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[]   = ['todo', 'in-progress', 'done'];

export interface ITask extends Document {
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: Date;
  tags: string[];
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'medium',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'todo',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as mongoose.Types.ObjectId).toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default Task;

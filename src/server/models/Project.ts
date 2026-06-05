import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  ownerEmail: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date;
  budget?: number;
  team: mongoose.Types.ObjectId[];
  tasksCount?: number;
  completedTasksCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold'],
      default: 'planning',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

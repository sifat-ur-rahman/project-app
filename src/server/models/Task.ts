import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  project: mongoose.Types.ObjectId;
  projectName: string;
  assignee: mongoose.Types.ObjectId;
  assigneeEmail: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: Date;
  createdBy: mongoose.Types.ObjectId;
  createdByEmail: string;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  comments?: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assigneeEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "todo",
        "in-progress",
        "review",
        "completed",
        "on-hold",
        "pending",
      ],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByEmail: {
      type: String,
      required: true,
    },
    subtasks: [
      {
        id: String,
        title: String,
        completed: Boolean,
      },
    ],
    comments: [String],
    attachments: [String],
  },
  { timestamps: true },
);

export default mongoose.models.Task ||
  mongoose.model<ITask>("Task", taskSchema);

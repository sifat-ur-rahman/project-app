import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  email: string;
  name: string;
  role: "admin" | "pm" | "member";
  department: string;
  assignedProjects: mongoose.Types.ObjectId[];
  tasksAssigned: number;
  tasksCompleted: number;
  joiningDate: Date;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "pm", "member"],
      default: "member",
    },
    department: {
      type: String,
      trim: true,
    },
    assignedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    tasksAssigned: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>("TeamMember", teamMemberSchema);

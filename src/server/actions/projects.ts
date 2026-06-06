"use server";

import { connectDB } from "../db";
import Project from "../models/Project";
import Task from "../models/Task";
import { Types } from "mongoose";

export async function getAllProjects() {
  try {
    await connectDB();

    const projects = await Project.find()
      .populate("owner", "name email")
      .populate("team", "name email")
      .sort({ createdAt: -1 });

    return {
      success: true,
      projects: projects.map((project) => ({
        id: project?._id.toString(),
        name: project?.name,
        description: project?.description,
        owner: {
          id: (project.owner as any)?._id?.toString(),
          name: (project.owner as any)?.name,
          email: (project.owner as any)?.email,
        },
        status: project.status,
        priority: project.priority,
        startDate: project.startDate?.toISOString(),
        endDate: project.endDate?.toISOString(),
        budget: project.budget,
        team: (project.team as any[]).map((member) => ({
          id: member._id?.toString(),
          name: member?.name,
          email: member?.email,
        })),
      })),
    };
  } catch (error) {
    console.error("Get projects error:", error);
    return {
      success: false,
      error: "Failed to fetch projects",
      projects: [],
    };
  }
}

export async function getProjectById(projectId: string) {
  try {
    await connectDB();

    const project = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("team", "name email");

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    const taskCount = await Task.countDocuments({ project: projectId });
    const completedCount = await Task.countDocuments({
      project: projectId,
      status: "completed",
    });

    return {
      success: true,
      project: {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        owner: {
          id: (project.owner as any)._id?.toString(),
          name: (project.owner as any).name,
          email: (project.owner as any).email,
        },
        status: project.status,
        priority: project.priority,
        startDate: project.startDate?.toISOString(),
        endDate: project.endDate?.toISOString(),
        budget: project.budget,
        tasksCount: taskCount,
        completedTasksCount: completedCount,
        team: (project.team as any[]).map((member) => ({
          id: member._id?.toString(),
          name: member.name,
          email: member.email,
        })),
      },
    };
  } catch (error) {
    console.error("Get project error:", error);
    return {
      success: false,
      error: "Failed to fetch project",
    };
  }
}

export async function createProject(data: {
  name: string;
  description: string;
  ownerEmail: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget?: number;
}) {
  try {
    await connectDB();

    const project = await Project.create({
      ...data,
      owner: new Types.ObjectId(),
      team: [],
    });

    return {
      success: true,
      project: {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
      },
    };
  } catch (error) {
    console.error("Create project error:", error);
    return {
      success: false,
      error: "Failed to create project",
    };
  }
}

export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
    priority?: string;
    endDate?: string;
    budget?: number;
  },
) {
  try {
    await connectDB();

    const project = await Project.findByIdAndUpdate(projectId, data, {
      new: true,
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    return {
      success: true,
      project: {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
      },
    };
  } catch (error) {
    console.error("Update project error:", error);
    return {
      success: false,
      error: "Failed to update project",
    };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await connectDB();

    // Delete associated tasks
    await Task.deleteMany({ project: projectId });

    // Delete project
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error("Delete project error:", error);
    return {
      success: false,
      error: "Failed to delete project",
    };
  }
}

export async function getProjectsByOwner(ownerEmail: string) {
  try {
    await connectDB();

    const projects = await Project.find({ ownerEmail }).populate(
      "owner",
      "name email",
    );

    return {
      success: true,
      projects: projects?.map((project) => ({
        id: project?._id.toString(),
        name: project?.name,
        description: project?.description,
        status: project?.status,
        priority: project?.priority,
        ownerEmail: project?.ownerEmail,
      })),
    };
  } catch (error) {
    console.error("Get projects by owner error:", error);
    return {
      success: false,
      error: "Failed to fetch projects",
      projects: [],
    };
  }
}

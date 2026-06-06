"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import Project from "../models/Project";
import Task from "../models/Task";
import { Types } from "mongoose";
import User from "../models/User";

export async function getAllTasks() {
  try {
    await connectDB();

    const tasks = await Task.find()
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    return {
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        projectName: task.projectName,
        projectId: task.project._id.toString(),
        assigneeEmail: task.assigneeEmail,
        assigneeName: task.assignee?.name,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.toISOString(),
        createdByEmail: task.createdByEmail,
      })),
    };
  } catch (error) {
    console.error("Get tasks error:", error);
    return {
      success: false,
      error: "Failed to fetch tasks",
      tasks: [],
    };
  }
}

export async function getTaskById(taskId: string) {
  try {
    await connectDB();

    const task = await Task.findById(taskId)
      .populate("assignee", "name email")
      .populate("project", "name");

    if (!task) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    return {
      success: true,
      task: {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        projectName: task.projectName,
        assigneeEmail: task.assigneeEmail,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.toISOString(),
        createdByEmail: task.createdByEmail,
        subtasks: task.subtasks,
      },
    };
  } catch (error) {
    console.error("Get task error:", error);
    return {
      success: false,
      error: "Failed to fetch task",
    };
  }
}

export async function createTask(data: {
  title: string;
  description: string;
  projectName?: string;
  projectId: string;
  assigneeEmail: string;
  status: string;
  priority: string;
  dueDate: string;
  createdByEmail: string;
}) {
  try {
    await connectDB();
    console.log("createTask server", data);
    const project = await Project.findById(data.projectId).lean();

    const assigneeId = await User.findOne({ email: data.assigneeEmail }).lean();

    if (!assigneeId) {
      return {
        success: false,
        error: "Assignee not found",
      };
    }

    if (project) {
      data.projectName = project.name;
    }

    const task = await Task.create({
      ...data,
      project: new Types.ObjectId(data.projectId),
      assignee: assigneeId?._id,
      createdBy: new Types.ObjectId(),
    });
    revalidatePath("/");
    return {
      success: true,
      task: {
        id: task._id.toString(),
        title: task.title,
        status: task.status,
      },
    };
  } catch (error) {
    console.error("Create task error:", error);
    return {
      success: false,
      error: "Failed to create task",
    };
  }
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    assigneeEmail?: string;
    assignee?: any;
  },
) {
  try {
    await connectDB();
    console.log("updateTask server", data);

    if (data.assigneeEmail) {
      const assigneeId = await User.findOne({
        email: data.assigneeEmail,
      }).lean();
      if (!assigneeId) {
        return {
          success: false,
          error: "Assignee not found",
        };
      }
      data.assignee = assigneeId?._id;
    }

    const task = await Task.findByIdAndUpdate(taskId, data, {
      new: true,
    }).lean();

    if (!task) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    return {
      success: true,
      task: {
        id: task._id.toString(),
        title: task.title,
        status: task.status,
      },
    };
  } catch (error) {
    console.error("Update task error:", error);
    return {
      success: false,
      error: "Failed to update task",
    };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await connectDB();

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.error("Delete task error:", error);
    return {
      success: false,
      error: "Failed to delete task",
    };
  }
}

export async function getTasksByProject(projectId: string) {
  try {
    await connectDB();

    const tasks = await Task.find({ project: projectId });

    return {
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        status: task.status,
        priority: task.priority,
        assigneeEmail: task.assigneeEmail,
      })),
    };
  } catch (error) {
    console.error("Get tasks by project error:", error);
    return {
      success: false,
      error: "Failed to fetch tasks",
      tasks: [],
    };
  }
}

export async function getTasksByAssignee(assigneeEmail: string) {
  try {
    await connectDB();

    const tasks = await Task.find({ assigneeEmail });

    return {
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        projectName: task.projectName,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Get tasks by assignee error:", error);
    return {
      success: false,
      error: "Failed to fetch tasks",
      tasks: [],
    };
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    await connectDB();

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true },
    );

    if (!task) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    return {
      success: true,
      task: {
        id: task._id.toString(),
        status: task.status,
      },
    };
  } catch (error) {
    console.error("Update task status error:", error);
    return {
      success: false,
      error: "Failed to update task status",
    };
  }
}

export async function getTasksByAssigneeEmail(email: string) {
  try {
    await connectDB();

    const tasks = await Task.find({ assigneeEmail: email });

    return {
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        status: task.status,
        priority: task.priority,
        assigneeEmail: task.assigneeEmail,
      })),
    };
  } catch (error) {
    console.error("Get tasks by project error:", error);
    return {
      success: false,
      error: "Failed to fetch tasks",
      tasks: [],
    };
  }
}

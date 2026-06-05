"use server";

import { connectDB } from "../db";
import User from "../models/User";
import TeamMember from "../models/TeamMember";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(email: string, password: string) {
  try {
    await connectDB();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Simple password comparison (in production, use bcrypt)
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return {
        success: false,
        error: "Invalid password",
      };
    }

    // Get team member info
    const teamMember = await TeamMember.findOne({ email }).populate(
      "assignedProjects",
    );

    const secret = process.env.TOKEN_SECRET as string;
    if (!secret) {
      throw new Error("Token secret not found");
    }

    const cleanUserObject = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    // Create Token & Set Token To Cookies
    const token = jwt.sign({ user: cleanUserObject }, secret, {
      expiresIn: "30d",
    });
    if (!token) {
      new Error("Token not found");
    }

    (await cookies()).set("task_forge_token", token, { maxAge: 2592000 });
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      teamMember: teamMember
        ? {
            id: teamMember._id.toString(),
            tasksAssigned: teamMember.tasksAssigned,
            tasksCompleted: teamMember.tasksCompleted,
            assignedProjects: teamMember.assignedProjects.map((p: any) =>
              p._id.toString(),
            ),
          }
        : null,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Login failed",
    };
  }
}

export async function logoutUser() {
  // Server-side logout logic if needed
  return {
    success: true,
  };
}

export async function getUserProfile(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const teamMember = await TeamMember.findOne({ user: userId }).populate(
      "assignedProjects",
    );

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      teamMember: teamMember
        ? {
            id: teamMember._id.toString(),
            tasksAssigned: teamMember.tasksAssigned,
            tasksCompleted: teamMember.tasksCompleted,
          }
        : null,
    };
  } catch (error) {
    console.error("Get profile error:", error);
    return {
      success: false,
      error: "Failed to fetch profile",
    };
  }
}

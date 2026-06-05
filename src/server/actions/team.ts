'use server';

import { connectDB } from '../db';
import TeamMember from '../models/TeamMember';
import User from '../models/User';
import { Types } from 'mongoose';

export async function getAllTeamMembers() {
  try {
    await connectDB();

    const members = await TeamMember.find().populate('user', 'name email').populate('assignedProjects', 'name');

    return {
      success: true,
      members: members.map((member) => ({
        id: member._id.toString(),
        email: member.email,
        name: member.name,
        role: member.role,
        department: member.department,
        tasksAssigned: member.tasksAssigned,
        tasksCompleted: member.tasksCompleted,
        status: member.status,
        joiningDate: member.joiningDate?.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Get team members error:', error);
    return {
      success: false,
      error: 'Failed to fetch team members',
      members: [],
    };
  }
}

export async function getTeamMemberByEmail(email: string) {
  try {
    await connectDB();

    const member = await TeamMember.findOne({ email }).populate('assignedProjects', 'name');

    if (!member) {
      return {
        success: false,
        error: 'Team member not found',
      };
    }

    return {
      success: true,
      member: {
        id: member._id.toString(),
        email: member.email,
        name: member.name,
        role: member.role,
        department: member.department,
        tasksAssigned: member.tasksAssigned,
        tasksCompleted: member.tasksCompleted,
        status: member.status,
      },
    };
  } catch (error) {
    console.error('Get team member error:', error);
    return {
      success: false,
      error: 'Failed to fetch team member',
    };
  }
}

export async function createTeamMember(data: {
  email: string;
  name: string;
  role: string;
  department: string;
  password: string;
}) {
  try {
    await connectDB();

    // Create user first
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      department: data.department,
    });

    // Create team member
    const member = await TeamMember.create({
      user: user._id,
      email: data.email,
      name: data.name,
      role: data.role,
      department: data.department,
    });

    return {
      success: true,
      member: {
        id: member._id.toString(),
        email: member.email,
        name: member.name,
        role: member.role,
      },
    };
  } catch (error) {
    console.error('Create team member error:', error);
    return {
      success: false,
      error: 'Failed to create team member',
    };
  }
}

export async function updateTeamMember(
  memberId: string,
  data: {
    name?: string;
    role?: string;
    department?: string;
    status?: string;
  }
) {
  try {
    await connectDB();

    const member = await TeamMember.findByIdAndUpdate(memberId, data, { new: true });

    if (!member) {
      return {
        success: false,
        error: 'Team member not found',
      };
    }

    return {
      success: true,
      member: {
        id: member._id.toString(),
        name: member.name,
        role: member.role,
        department: member.department,
      },
    };
  } catch (error) {
    console.error('Update team member error:', error);
    return {
      success: false,
      error: 'Failed to update team member',
    };
  }
}

export async function deleteTeamMember(memberId: string) {
  try {
    await connectDB();

    const member = await TeamMember.findByIdAndDelete(memberId);

    if (!member) {
      return {
        success: false,
        error: 'Team member not found',
      };
    }

    // Also delete the associated user
    if (member.user) {
      await User.deleteOne({ _id: member.user });
    }

    return {
      success: true,
      message: 'Team member deleted successfully',
    };
  } catch (error) {
    console.error('Delete team member error:', error);
    return {
      success: false,
      error: 'Failed to delete team member',
    };
  }
}

export async function getTeamMembersByRole(role: string) {
  try {
    await connectDB();

    const members = await TeamMember.find({ role });

    return {
      success: true,
      members: members.map((member) => ({
        id: member._id.toString(),
        email: member.email,
        name: member.name,
        role: member.role,
        department: member.department,
      })),
    };
  } catch (error) {
    console.error('Get team members by role error:', error);
    return {
      success: false,
      error: 'Failed to fetch team members',
      members: [],
    };
  }
}

export async function updateTeamMemberStats(
  memberId: string,
  tasksAssigned: number,
  tasksCompleted: number
) {
  try {
    await connectDB();

    const member = await TeamMember.findByIdAndUpdate(
      memberId,
      { tasksAssigned, tasksCompleted },
      { new: true }
    );

    if (!member) {
      return {
        success: false,
        error: 'Team member not found',
      };
    }

    return {
      success: true,
      member: {
        id: member._id.toString(),
        tasksAssigned: member.tasksAssigned,
        tasksCompleted: member.tasksCompleted,
      },
    };
  } catch (error) {
    console.error('Update team member stats error:', error);
    return {
      success: false,
      error: 'Failed to update stats',
    };
  }
}

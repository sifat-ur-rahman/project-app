import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Project from '../models/Project';
import Task from '../models/Task';
import TeamMember from '../models/TeamMember';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
  },
  {
    name: 'Project Manager',
    email: 'pm@company.com',
    password: 'pm123',
    role: 'pm',
    department: 'Project Management',
  },
  {
    name: 'Team Member',
    email: 'member@company.com',
    password: 'member123',
    role: 'member',
    department: 'Development',
  },
  {
    name: 'John Developer',
    email: 'john@company.com',
    password: 'john123',
    role: 'member',
    department: 'Development',
  },
  {
    name: 'Sarah Designer',
    email: 'sarah@company.com',
    password: 'sarah123',
    role: 'member',
    department: 'Design',
  },
  {
    name: 'Mike Backend',
    email: 'mike@company.com',
    password: 'mike123',
    role: 'member',
    department: 'Backend',
  },
  {
    name: 'Lisa QA',
    email: 'lisa@company.com',
    password: 'lisa123',
    role: 'member',
    department: 'QA',
  },
  {
    name: 'Robert Manager',
    email: 'robert@company.com',
    password: 'robert123',
    role: 'pm',
    department: 'Project Management',
  },
];

const demoProjects = [
  {
    name: 'Mobile App Redesign',
    description: 'Complete redesign of the mobile application UI/UX',
    ownerEmail: 'pm@company.com',
    status: 'in-progress',
    priority: 'high',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    budget: 50000,
  },
  {
    name: 'API Performance Optimization',
    description: 'Optimize API response times and database queries',
    ownerEmail: 'admin@company.com',
    status: 'in-progress',
    priority: 'critical',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-15'),
    budget: 30000,
  },
  {
    name: 'Customer Portal Development',
    description: 'Build new customer self-service portal',
    ownerEmail: 'pm@company.com',
    status: 'planning',
    priority: 'high',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-09-30'),
    budget: 75000,
  },
  {
    name: 'Security Audit & Implementation',
    description: 'Conduct security audit and implement fixes',
    ownerEmail: 'admin@company.com',
    status: 'in-progress',
    priority: 'critical',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-07-31'),
    budget: 45000,
  },
  {
    name: 'Data Analytics Dashboard',
    description: 'Create comprehensive analytics dashboard',
    ownerEmail: 'robert@company.com',
    status: 'in-progress',
    priority: 'medium',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-08-15'),
    budget: 40000,
  },
  {
    name: 'Documentation Website',
    description: 'Build developer documentation website',
    ownerEmail: 'pm@company.com',
    status: 'planning',
    priority: 'medium',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-07-31'),
    budget: 20000,
  },
  {
    name: 'Cloud Migration',
    description: 'Migrate on-premise infrastructure to cloud',
    ownerEmail: 'admin@company.com',
    status: 'planning',
    priority: 'high',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-12-31'),
    budget: 100000,
  },
  {
    name: 'Email Notification System',
    description: 'Implement automated email notification system',
    ownerEmail: 'pm@company.com',
    status: 'completed',
    priority: 'medium',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    budget: 15000,
  },
  {
    name: 'Mobile Push Notifications',
    description: 'Add push notification support to mobile app',
    ownerEmail: 'robert@company.com',
    status: 'in-progress',
    priority: 'high',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-07-15'),
    budget: 25000,
  },
  {
    name: 'Social Media Integration',
    description: 'Integrate social media sharing features',
    ownerEmail: 'pm@company.com',
    status: 'completed',
    priority: 'low',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-02-28'),
    budget: 18000,
  },
  {
    name: 'Payment Gateway Integration',
    description: 'Integrate Stripe and PayPal payments',
    ownerEmail: 'admin@company.com',
    status: 'completed',
    priority: 'critical',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-04-30'),
    budget: 35000,
  },
  {
    name: 'Chatbot Implementation',
    description: 'Build AI-powered customer support chatbot',
    ownerEmail: 'robert@company.com',
    status: 'planning',
    priority: 'medium',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-11-30'),
    budget: 55000,
  },
];

const taskTitles = [
  'Design mockups',
  'Frontend implementation',
  'Backend API development',
  'Database schema design',
  'Unit testing',
  'Integration testing',
  'Code review',
  'Documentation',
  'Deployment preparation',
  'User acceptance testing',
  'Bug fixes',
  'Performance optimization',
  'Security hardening',
  'Client presentation',
  'Training documentation',
];

const taskDescriptions = [
  'Complete initial design and mockups for user review',
  'Implement frontend components and pages',
  'Develop backend API endpoints',
  'Design and optimize database schema',
  'Write and run unit tests',
  'Perform integration testing',
  'Review code for quality and standards',
  'Write comprehensive documentation',
  'Prepare deployment scripts and checklist',
  'Conduct user acceptance testing',
  'Fix identified bugs and issues',
  'Optimize performance metrics',
  'Implement security best practices',
  'Present progress to stakeholders',
  'Create training materials for users',
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await TeamMember.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create(demoUsers);
    console.log(`Created ${users.length} users`);

    // Create projects with owner references
    const projectsData = demoProjects.map((proj) => {
      const owner = users.find((u) => u.email === proj.ownerEmail);
      return {
        ...proj,
        owner: owner!._id,
        team: [owner!._id],
      };
    });

    const projects = await Project.create(projectsData);
    console.log(`Created ${projects.length} projects`);

    // Create team members
    const teamMembersData = users.map((user) => ({
      user: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      assignedProjects: projects.slice(0, 3).map((p) => p._id),
      tasksAssigned: 0,
      tasksCompleted: 0,
    }));

    const teamMembers = await TeamMember.create(teamMembersData);
    console.log(`Created ${teamMembers.length} team members`);

    // Create tasks
    const tasks = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const numTasks = Math.floor(Math.random() * 8) + 3;

      for (let j = 0; j < numTasks; j++) {
        const assignee = users[Math.floor(Math.random() * users.length)];
        const statuses = ['todo', 'in-progress', 'review', 'completed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const task = {
          title: `${taskTitles[Math.floor(Math.random() * taskTitles.length)]} - ${project.name}`,
          description: taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)],
          project: project._id,
          projectName: project.name,
          assignee: assignee._id,
          assigneeEmail: assignee.email,
          status,
          priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          dueDate: new Date(Date.now() + Math.random() * 120 * 24 * 60 * 60 * 1000),
          createdBy: project.owner,
          createdByEmail: project.ownerEmail,
        };

        tasks.push(task);
      }
    }

    const createdTasks = await Task.create(tasks);
    console.log(`Created ${createdTasks.length} tasks`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

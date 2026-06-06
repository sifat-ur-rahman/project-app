# Project Management Application

## [TaskForge](https://task-forge-pink.vercel.app)

A modern, full-featured project management system built with **Next.js 16**, **React 19**, **MongoDB**, and **Tailwind CSS**. Features role-based access control, real-time task management, team collaboration, and comprehensive analytics with a production-ready backend.

---

## Table of Contents

- [Features Overview](#features-overview)
- [Project Setup Instructions](#project-setup-instructions)
- [Environment Variables](#environment-variables)
- [Demo Credentials](#demo-credentials)
- [Deployment Instructions](#deployment-instructions)

---

## Features Overview

### Core Capabilities

**Project Management**

- Create, edit, and delete projects with status tracking
- Set project deadlines, budgets, and priority levels
- Assign team members to projects
- Track project progress and completion rates

**Task Management**

- Full task lifecycle (create, assign, update, complete, delete)
- Task priorities (critical, high, medium, low)
- Task statuses (pending, in-progress, completed)
- Due date tracking and notifications
- Task filtering and search capabilities

**Team Collaboration**

- Add and manage team members
- Assign roles (Admin, Project Manager, Team Member)
- View team member activity and statistics
- Task assignment and delegation

**Analytics & Reporting**

- Real-time dashboard with system metrics
- Task completion rates and trends
- Project status breakdown
- Team productivity analytics
- Custom analytics dashboards per role

**Additional Features**

- Dark theme
- Responsive mobile design
- Real-time data persistence with MongoDB
- Server-side rendering with Next.js
- TypeScript type safety throughout

---

## Project Setup Instructions

### Prerequisites

- **Node.js** 18+
- **MongoDB** instance (local or MongoDB Atlas cloud)
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/sifat-ur-rahman/task-forge.git
cd task-forge
```

#### 2. Install Dependencies

```bash
# using npm
npm install
```

## Environment Variables

```bash

MONGODB_URI=mongodb://localhost:27017/task-forge-db
TOKEN_SECRET=your_secret_key_here

```

## Run Development Server

```bash
npm run dev
```

## Demo Credentials

After running `pnpm seed`, three demo accounts are available:

### Admin Account

- **Email**: `admin@company.com`
- **Password**: `admin123`
- **Role**: Administrator (full system access)
- **Can**: View all data, create/edit/delete projects and tasks, manage team members, view all analytics

### Project Manager Account

- **Email**: `pm@company.com`
- **Password**: `pm123`
- **Role**: Project Manager (project and task management)
- **Can**: Create own projects, manage tasks, view team, view own project analytics

### Team Member Account

- **Email**: `member@company.com`
- **Password**: `member123`
- **Role**: Team Member (limited task access)
- **Can**: View assigned tasks, update task status, view own performance

### Login Process

1. Navigate to **http://localhost:3000**
2. Click on **"Login"** or **"Get Started"** button
3. Click on **"Admin Demo"**, **"PM Demo"**, or **"Member Demo"** button
4. Or enter credentials manually:
   - Email: Use demo email above
   - Password: Use demo password above
5. You'll be redirected to your role-specific dashboard

## Deployment Instructions

### Deploying to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Select your repository
5. Configure the project:
   - Framework: **Next.js**
   - Root Directory: **./** (project root)

#### Step 3: Add Environment Variables

In the Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add `MONGODB_URI` with your production MongoDB connection string
3. Select environments: **Production**, **Preview**, **Development**
4. Click **Save**

#### Step 4: Deploy

```bash
# Vercel auto-deploys on push to main branch
git push origin main
```

Or manually deploy from the Vercel dashboard.

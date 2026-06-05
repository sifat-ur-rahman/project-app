# Project Management Application TaskForge

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

**Role-Based Access Control**

| Feature             | Admin | PM  | Member |
| ------------------- | ----- | --- | ------ |
| View all projects   | ✅    | ❌  | ❌     |
| Create projects     | ✅    | ✅  | ❌     |
| Edit own projects   | ✅    | ✅  | ❌     |
| Edit all projects   | ✅    | ❌  | ❌     |
| Delete projects     | ✅    | ❌  | ❌     |
| Create tasks        | ✅    | ✅  | ❌     |
| Edit all tasks      | ✅    | ✅  | ❌     |
| Edit assigned tasks | ✅    | ✅  | ✅     |
| Delete tasks        | ✅    | ❌  | ❌     |
| Manage team         | ✅    | ❌  | ❌     |
| View analytics      | ✅    | ✅  | ❌     |

**Additional Features**

- Dark/Light theme switching
- Responsive mobile design
- Real-time data persistence with MongoDB
- Server-side rendering with Next.js
- TypeScript type safety throughout

---

## Project Setup Instructions

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm**, **pnpm**, **yarn**, or **bun** package manager
- **MongoDB** instance (local or MongoDB Atlas cloud)
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-management-app
```

#### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install

# Or using bun
bun install
```

#### 3. Setup MongoDB Connection

Create a `.env.local` file in the project root:

```bash
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/project-management-db

# OR for MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/project-management-db?retryWrites=true&w=majority
```

**If using local MongoDB**, ensure MongoDB is running:

```bash
# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongodb

# On Windows
net start MongoDB
```

#### 4. Seed Demo Data

Populate the database with sample data (8 users, 12 projects, 56 tasks):

```bash
pnpm seed
```

This creates demo accounts and realistic project/task data for testing.

#### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at **http://localhost:3000**

---

## Environment Variables

### Required Variables

| Variable      | Description               | Example                                           |
| ------------- | ------------------------- | ------------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/project-management-db` |

### Optional Variables

Currently, all required environment variables are listed above. Additional configuration options may be added for production deployments.

### Setup Instructions

1. Create a `.env.local` file in the project root directory
2. Copy the template from `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Fill in your MongoDB URI:

```bash
MONGODB_URI=mongodb://localhost:27017/project-management-db
```

4. Save the file (it will be gitignored automatically)

---

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
2. Click on **"Admin Demo"**, **"PM Demo"**, or **"Member Demo"** button
3. Or enter credentials manually:
   - Email: Use demo email above
   - Password: Use demo password above
4. You'll be redirected to your role-specific dashboard

### Create New Users

You can also create new users via the **Signup** page:

1. Click **"Create Account"** on the login page
2. Enter email, password, and full name
3. New users are created as Team Members by default
4. Login with your new credentials

---

## Deployment Instructions

### Deployment Checklist

Before deploying to production:

- [ ] MongoDB instance is provisioned (use MongoDB Atlas for cloud)
- [ ] Environment variables are set in production
- [ ] All demo data has been backed up or removed
- [ ] User authentication is properly configured
- [ ] HTTPS is enabled on the deployment platform
- [ ] Database backups are configured

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

### Deploying to Other Platforms

#### AWS (EC2 + RDS)

```bash
# 1. SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance.amazonaws.com

# 2. Clone repository
git clone <repository-url>
cd project-management-app

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install dependencies
npm install

# 5. Create .env file
echo "MONGODB_URI=mongodb+srv://user:pass@your-cluster.mongodb.net/project-management-db" > .env.local

# 6. Build and start
npm run build
npm start
```

#### Docker Deployment

```bash
# Build Docker image
docker build -t project-management-app .

# Run container
docker run -e MONGODB_URI="<your-mongodb-uri>" -p 3000:3000 project-management-app
```

#### Environment-Specific Deployments

**Development**

- URL: staging.example.com
- Database: Development MongoDB instance
- Features: All features enabled, verbose logging

**Production**

- URL: app.example.com
- Database: Production MongoDB Atlas cluster
- Features: All features enabled, optimized builds
- Backups: Daily automated backups
- Monitoring: Performance and error tracking enabled

### Post-Deployment Setup

After successful deployment:

1. **Test Login**: Verify all demo accounts work
2. **Check Database**: Confirm data persists across requests
3. **Run Load Test**: Test with multiple concurrent users
4. **Monitor Performance**: Check response times and error rates
5. **Configure Monitoring**: Set up error tracking (optional)

### Database Backup & Recovery

#### Backup Strategy

```bash
# Backup MongoDB (Atlas)
# Use Atlas automated backups (enabled by default)

# Or manual backup
mongodump --uri="your-mongodb-uri" --out=./backup
```

#### Recovery

```bash
# Restore from backup
mongorestore --uri="your-mongodb-uri" ./backup
```

### Scaling Considerations

- **Database**: Use MongoDB Atlas auto-scaling for production
- **Server**: Enable auto-scaling on hosting platform (Vercel, AWS, etc.)
- **Caching**: Add Redis for session caching if needed
- **CDN**: Enable CDN for static assets (automatic on Vercel)

---

## Quick Reference

### Common Commands

```bash
# Development
pnpm dev              # Start dev server

# Production Build
pnpm build            # Create optimized build
pnpm start            # Start production server

# Database
pnpm seed             # Populate with demo data

# Code Quality
pnpm lint             # Run ESLint
```

### Useful Links

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev

### Support

For issues or questions:

1. Check the documentation files in the project root
2. Review GitHub issues for similar problems
3. Contact the development team

---

**Last Updated**: 2024
**Version**: 1.0.0
**License**: MIT

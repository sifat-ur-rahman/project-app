# Project Management Application

A modern, full-featured project management system built with Next.js 16, React 19, and Tailwind CSS. Features role-based access control, real-time task management, team collaboration, and comprehensive analytics.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)
- [Role-Based Access Control](#role-based-access-control)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Development](#development)

## Features

### Core Features

- **Role-Based Access Control**: Three user roles (Admin, Project Manager, Team Member) with granular permissions
- **Project Management**: Create, edit, delete, and manage projects with status tracking
- **Task Management**: Full task lifecycle management with priorities, due dates, and status updates
- **Team Collaboration**: Add and manage team members with role assignments
- **Real-Time Analytics**: Dashboard with charts, metrics, and activity tracking
- **Dark Mode Support**: Full dark/light theme switching with persistent preferences
- **Responsive Design**: Mobile-friendly interface that works on all devices

### Admin Features

- Full system access
- Create and manage projects
- Assign and manage tasks
- Manage team members
- View all analytics and reports
- Delete projects and tasks

### Project Manager Features

- Create and manage own projects
- Assign tasks to team members
- Edit project details
- View team and analytics
- Cannot delete projects or manage team

### Team Member Features

- View assigned tasks only
- Update task status
- Mark tasks as complete
- Cannot create projects or tasks
- Cannot access team management
- Cannot delete any items

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **Recharts** - Beautiful charts and visualizations
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

### Styling

- Pure Tailwind CSS (no component libraries)
- Custom UI components built with Tailwind
- Responsive design system
- Dark mode with theme switching

### State Management

- React hooks (useState, useContext)
- SessionStorage for authentication demo
- Client-side state management

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd project-management-app
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
# or
yarn install
# or
bun install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Run the development server**

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
# or
yarn build
yarn start
```

## Environment Variables

### Local Development (.env.local)

```env
# Application
NEXT_PUBLIC_APP_NAME=Project Manager
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features
NEXT_PUBLIC_DEMO_MODE=true
```

### Required Environment Variables

- `NEXT_PUBLIC_APP_NAME` - Application display name
- `NEXT_PUBLIC_APP_URL` - Application URL (used for links and redirects)
- `NEXT_PUBLIC_DEMO_MODE` - Enable demo mode with preset credentials (default: true)

### Optional Environment Variables

- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID (Vercel Analytics)
- `NEXT_PUBLIC_DISABLE_DARK_MODE` - Disable dark mode toggle (default: false)

## Demo Credentials

The application includes three pre-configured demo accounts for testing different role levels. No sign-up is required.

### Admin Account

```
Email: admin@company.com
Role: Administrator (Full Access)
Password: Not required (demo mode)
```

**Access**: Create/edit/delete projects and tasks, manage team members, view all analytics

### Project Manager Account

```
Email: pm@company.com
Role: Project Manager (Project & Task Management)
Password: Not required (demo mode)
```

**Access**: Create/edit projects, assign tasks, view analytics, cannot delete or manage team

### Team Member Account

```
Email: member@company.com
Role: Team Member (Limited Access)
Password: Not required (demo mode)
```

**Access**: Update assigned tasks only, cannot create, edit, or delete projects/tasks

### How to Use Demo Credentials

1. Navigate to the login page at `http://localhost:3000/auth/login`
2. Click on the demo account button for the role you want to test
3. The app automatically logs you in with that role
4. Click "Logout" in the sidebar to switch accounts

**Note**: Demo data is stored in browser SessionStorage and resets on browser close. All changes are non-persistent in demo mode.

## Project Structure

```
project-management-app/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page with demo buttons
│   │   └── signup/
│   │       └── page.tsx          # Signup page
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard home/overview
│   │   ├── projects/
│   │   │   ├── page.tsx          # Projects list with CRUD
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Project detail view
│   │   ├── tasks/
│   │   │   └── page.tsx          # Tasks management with filters
│   │   ├── team/
│   │   │   └── page.tsx          # Team member management
│   │   └── analytics/
│   │       └── page.tsx          # Analytics dashboard
│   ├── layout.tsx                # Root layout with dark mode
│   ├── page.tsx                  # Home page (redirects to auth/login)
│   └── globals.css               # Global styles and Tailwind config
├── components/
│   ├── ui/                       # Reusable Tailwind-based components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── checkbox.tsx
│   │   ├── table.tsx
│   │   └── empty-state.tsx
│   └── dashboard/
│       └── sidebar.tsx           # Navigation sidebar
├── lib/
│   ├── auth.ts                   # Role-based access control utilities
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts            # Tailwind CSS config
├── next.config.mjs               # Next.js config
└── README.md                     # This file
```

## Role-Based Access Control

### Permission Matrix

| Feature         | Admin | PM  | Member        |
| --------------- | ----- | --- | ------------- |
| Create Projects | ✅    | ✅  | ❌            |
| Edit Projects   | ✅    | ✅  | ❌            |
| Delete Projects | ✅    | ❌  | ❌            |
| Create Tasks    | ✅    | ✅  | ❌            |
| Edit All Tasks  | ✅    | ✅  | ❌            |
| Edit Own Tasks  | ✅    | ✅  | ✅            |
| Delete Tasks    | ✅    | ❌  | ❌            |
| Manage Team     | ✅    | ❌  | ❌            |
| View All Tasks  | ✅    | ✅  | ❌ (Own Only) |
| View Analytics  | ✅    | ✅  | ❌            |

### Implementation

The RBAC system is implemented in `/lib/auth.ts` with utility functions:

- `getUserRole()` - Get current user's role
- `hasPermission(role, permission)` - Check if user has specific permission
- `canUserEditTask(role, assigneeEmail)` - Check if user can edit a task
- `canUserDeleteTask(role)` - Check if user can delete tasks
- `canUserDeleteProject(role)` - Check if user can delete projects

## Usage Guide

### Creating a Project

1. Log in with Admin or PM credentials
2. Navigate to "Projects" in the sidebar
3. Click "New Project" button
4. Fill in project details (name, description, status)
5. Click "Create Project"

### Creating a Task

1. Navigate to "Tasks" in the sidebar
2. Click "New Task" button (Admin/PM only)
3. Fill in task details (title, project, priority, due date)
4. Click "Create Task"

### Updating Task Status (Member Access)

1. Navigate to "Tasks" in the sidebar
2. Team members see only their assigned tasks
3. Click the checkbox next to a task to toggle status
4. Or click "Edit" to update task details

### Managing Team Members

1. Log in with Admin credentials
2. Navigate to "Team" in the sidebar
3. Click "Add Member" to add new team members
4. Click "Edit" to update member details
5. Click delete icon to remove members

### Viewing Analytics

1. Navigate to "Analytics" in the sidebar
2. View project distribution, task completion rates, and team performance
3. Charts update based on project and task data

## Deployment

### Deploy to Vercel

The application is optimized for deployment on Vercel.

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**

- Visit [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Vercel auto-detects Next.js configuration
- Click "Deploy"

3. **Environment Variables on Vercel**

- Go to Project Settings → Environment Variables
- Add required environment variables
- Redeploy for changes to take effect

### Deploy to Other Platforms

#### Netlify

```bash
# Build the project
pnpm build

# Deploy the .next folder
# (Requires Node.js runtime support)
```

#### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t project-manager .
docker run -p 3000:3000 project-manager
```

#### Self-Hosted

```bash
# Build production bundle
pnpm build

# Start server
pnpm start

# Server runs on http://localhost:3000
```

## Development

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- React hooks for state management
- ESLint configuration included

### Running Tests

```bash
pnpm lint
```

### Making Changes

1. **Add a new component**

```bash
# Create component in /components/ui/
touch components/ui/new-component.tsx
```

2. **Add a new page**

```bash
# Create page in /app/dashboard/
mkdir -p app/dashboard/new-page
touch app/dashboard/new-page/page.tsx
```

3. **Update styles**

- Edit Tailwind classes in component files
- Update design tokens in `/app/globals.css` if needed

View logs in browser DevTools Console.

## Features Overview

### Dashboard

- Key metrics overview
- Project statistics
- Task completion charts
- Recent activity feed
- Quick access to projects and tasks

### Projects Page

- List of all projects with search
- Project status badges (Active, On-Hold, Completed)
- Progress indicators
- Action buttons (View, Edit, Delete)
- Modal for creating/editing projects
- Confirmation dialog for delete operations

### Tasks Page

- Advanced filtering (status, priority, search)
- Sortable columns
- Quick status toggle via checkbox
- Role-based visibility (members see assigned tasks only)
- Modal for creating/editing tasks
- Confirmation dialog for deletions

### Team Page

- Team member cards with roles
- Status indicators
- Project assignments
- Contact information
- Add/Edit/Remove members (Admin only)
- Message button for communication

### Analytics Page

- Project status distribution
- Task completion trends
- Team productivity metrics
- Key performance indicators
- Performance breakdown by team member

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

**Important**: This is a demonstration application. For production use:

1. **Replace Demo Authentication**
   - Implement real authentication (Better Auth, Auth.js, Firebase, etc.)
   - Use secure password hashing
   - Implement JWT or session tokens

2. **Add Backend API**
   - Create API routes in `/app/api/`
   - Add proper request validation
   - Implement rate limiting
   - Add CORS configuration

3. **Database Integration**
   - Use PostgreSQL, MongoDB, or similar
   - Implement proper data persistence
   - Add database migrations

4. **Security Headers**
   - Configure CORS
   - Add CSRF protection
   - Implement rate limiting
   - Add security headers middleware

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:

1. Check existing documentation
2. Review the code comments
3. Check browser console for errors
4. Test with different demo roles

## Changelog

### Version 1.0.0

- Initial release
- Role-based access control
- Project and task management
- Team collaboration features
- Analytics dashboard
- Dark mode support
- Responsive design

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using Next.js, React, and Tailwind CSS

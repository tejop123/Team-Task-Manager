# Team Task Manager - Frontend

React-based frontend for Team Task Manager application with role-based access control.

## Features

- User Authentication (Signup/Login)
- Responsive Dashboard with task statistics
- Project Management Interface
- Task Management with status tracking
- Role-Based Access Control
- Real-time updates via API integration

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable React components
│   ├── context/         # React Context for state management
│   ├── pages/           # Page components
│   ├── services/        # API service calls
│   ├── styles/          # CSS styling
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
├── package.json
└── .env.example
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file from example:
```bash
cp .env.example .env
```

4. Update .env with backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm start
```

Application will open at `http://localhost:3000`

### Build for Production
```bash
npm build
```

## Project Layout

### Components
- **Login.js** - User login form
- **Signup.js** - User registration form
- **Dashboard.js** - Main dashboard with task statistics
- **ProjectsList.js** - Display all projects
- **ProjectDetail.js** - Project details with tasks
- **CreateProject.js** - Create new project form
- **TaskDetail.js** - Task details and edit form
- **Navbar.js** - Navigation header
- **PrivateRoute.js** - Protected route wrapper

### Context
- **AuthContext.js** - Global authentication state management

### Services
- **api.js** - Axios instance with interceptors
- **authService.js** - Authentication API calls
- **projectService.js** - Project API calls
- **taskService.js** - Task API calls

### Styles
- **index.css** - Global CSS styling

## Features

### Authentication
- User signup with email validation
- User login with JWT token storage
- Protected routes with PrivateRoute component
- Automatic token inclusion in API requests

### Dashboard
- Task statistics (total, completed, overdue, etc.)
- Assigned tasks list with status and priority
- Quick overview of all projects
- Task filtering by status and priority

### Project Management
- Create new projects
- View all projects with member count
- Edit project details
- Add members to projects
- Delete projects
- View project-specific tasks

### Task Management
- Create tasks within projects
- Assign tasks to team members
- Update task status (To Do, In Progress, Completed, On Hold)
- Set task priority (Low, Medium, High, Urgent)
- Set due dates
- View task details
- Edit and delete tasks
- Track overdue tasks

### Role-Based Access
- Admin: Full project and task management
- Member: Limited access based on project membership

## API Integration

The frontend uses Axios for API communication with the following interceptor:
- Automatically adds JWT token to request headers
- Handles API errors gracefully

## Styling

Global CSS includes:
- Responsive grid layout (grid-2, grid-3)
- Button styles (primary, secondary, danger)
- Card components for content
- Badge styles for status and priority
- Form styling with validation
- Table styling
- Navbar styling
- Alert messages (error, success)

## Responsive Design

- Mobile-friendly layout
- Grid system that adapts to screen size
- Touch-friendly buttons and inputs
- Optimized for tablets and desktops

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

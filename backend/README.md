# Team Task Manager - Backend API

REST API backend for Team Task Manager application built with Express.js and MongoDB.

## Features

- User Authentication (JWT-based)
- Project Management with member assignment
- Task Management with status tracking
- Role-Based Access Control (Admin/Member)
- Dashboard with task statistics
- Complete CRUD operations for projects and tasks

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware (auth, validation)
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Express server entry point
├── package.json
└── .env.example
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file from example:
```bash
cp .env.example .env
```

4. Update .env with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `POST /api/projects` - Create new project (protected)
- `GET /api/projects/:id` - Get project by ID (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/members` - Add member to project (protected)

### Tasks
- `GET /api/tasks` - Get all tasks with filters (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `GET /api/tasks/dashboard` - Get dashboard statistics (protected)

## Database Models

### User
- name (string, required)
- email (string, unique, required)
- password (string, hashed, required)
- role (enum: 'admin', 'member')
- createdAt, updatedAt

### Project
- name (string, required)
- description (string)
- admin (ObjectId, ref: User)
- members (array of {userId, role})
- status (enum: 'active', 'completed', 'archived')
- createdAt, updatedAt

### Task
- title (string, required)
- description (string)
- project (ObjectId, ref: Project)
- assignedTo (ObjectId, ref: User)
- createdBy (ObjectId, ref: User)
- status (enum: 'todo', 'in-progress', 'completed', 'on-hold')
- priority (enum: 'low', 'medium', 'high', 'urgent')
- dueDate (Date)
- createdAt, updatedAt

## Error Handling

All endpoints return errors in the following format:
```json
{
  "message": "Error description"
}
```

Or for validation errors:
```json
{
  "errors": [
    {
      "param": "field_name",
      "msg": "error_message"
    }
  ]
}
```

## Middleware

- **auth**: Validates JWT token and attaches user to request
- **roleCheck**: Validates user role for protected endpoints

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation with express-validator
- CORS enabled for frontend communication

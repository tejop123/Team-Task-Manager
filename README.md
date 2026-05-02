# Team Task Manager - Full Stack Application

A comprehensive full-stack web application for managing team projects and tasks with role-based access control. Built with Express.js backend and React frontend.

## 📋 Features

### Core Features
- **Authentication System**
  - Separate Admin and Member signup/login flows
  - JWT tokens with 7-day expiration
  - Secure password hashing with bcryptjs
  - Protected routes and API endpoints
  - Role-based access control (Admin vs Member)

- **Project Management**
  - Create and manage projects
  - Add team members to projects
  - Assign roles (Admin/Member) to members
  - Track project status (Active, Completed, Archived)

- **Task Management**
  - Create tasks within projects
  - Assign tasks to team members
  - Track task status (To Do, In Progress, Completed, On Hold)
  - Set priority levels (Low, Medium, High, Urgent)
  - Set due dates and track overdue tasks

- **Dashboard**
  - Overview of task statistics
  - Display assigned tasks
  - Show project summary
  - Track overdue tasks

- **Role-Based Access Control**
  - Admin: Full project and task management
  - Member: Limited access based on project membership

## 🏗️ Project Structure

```
team task manager/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth & validation
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   └── server.js          # Entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── frontend/                   # React.js UI
    ├── public/
    ├── src/
    │   ├── components/        # React components
    │   ├── context/           # State management
    │   ├── services/          # API calls
    │   ├── styles/            # CSS files
    │   ├── App.js
    │   └── index.js
    ├── package.json
    ├── .env.example
    └── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Update .env with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Update .env:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/admin-signup` - Register new admin account
- `POST /api/auth/admin-login` - Login as admin
- `POST /api/auth/member-signup` - Register new member account
- `POST /api/auth/member-login` - Login as member
- `POST /api/auth/signup` - Register new user (generic)
- `POST /api/auth/login` - Login user (generic)
- `GET /api/auth/profile` - Get current user profile

### Project Endpoints
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project

### Task Endpoints
- `GET /api/tasks` - Get tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/dashboard` - Get dashboard statistics

## 💾 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  name: String,
  description: String,
  admin: ObjectId (User),
  members: [{userId: ObjectId, role: String}],
  status: 'active' | 'completed' | 'archived',
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  status: 'todo' | 'in-progress' | 'completed' | 'on-hold',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Role-Based Access Control

### Admin Role
- ✅ Separate admin login/signup page
- ✅ Create and manage projects
- ✅ Add members to projects
- ✅ Create tasks within projects
- ✅ Assign tasks to team members
- ✅ Update task status and details
- ✅ View admin panel with task assignment interface
- ✅ Access admin-specific routes and features

### Member Role
- ✅ Separate member login/signup page
- ✅ View assigned projects
- ✅ View and complete assigned tasks
- ✅ Update task status (To Do → In Progress → Completed)
- ✅ Add progress notes to tasks
- ✅ Filter tasks by status and priority
- ✅ Access member panel with task dashboard
- ❌ Cannot create projects
- ❌ Cannot assign tasks
- ❌ Cannot manage members
- ❌ Cannot access admin panel

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication with expiration
- Protected API endpoints with middleware
- Input validation with express-validator
- CORS enabled for frontend communication
- Role-based authorization checks
- Separate authentication flows per role
- Access denied protection on role-restricted routes

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management
- **CSS** - Styling

## 📱 UI Features

- Responsive design (mobile, tablet, desktop)
- Dashboard with task statistics
- Project management interface
- Task creation and tracking
- Team member management
- Status and priority badges
- Overdue task highlighting
- Clean and intuitive navigation

## 🎯 User Workflows

### Admin Workflow
1. Sign up as admin at `/admin-signup`
2. Login at `/admin-login` (redirects to admin panel)
3. Create project from Projects page
4. Invite team members to project
5. Create tasks in projects
6. Assign tasks to members from Admin Panel
7. Track task progress and status
8. Update/delete tasks

### Member Workflow
1. Sign up as member at `/member-signup`
2. Login at `/member-login` (redirects to member panel)
3. View assigned tasks in "My Tasks" page
4. View task details and requirements
5. Update task status (todo → in-progress → completed)
6. Add progress notes to document work
7. View task statistics in dashboard
8. Filter tasks by status and priority

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend (Heroku/Railway/Vercel)
1. Push backend code to repository
2. Set environment variables
3. Deploy using platform-specific commands

### Frontend (Vercel/Netlify)
1. Push frontend code to repository
2. Set environment variables
3. Deploy using platform-specific commands

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please create an issue in the repository.

## 🎓 Learning Resources

This project demonstrates:
- Full-stack web development
- REST API design
- Authentication and authorization
- Database design and relationships
- React component architecture
- State management with Context API
- Form handling and validation
- Error handling and logging

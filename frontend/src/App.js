import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import AdminSignup from './components/AdminSignup';
import CreateProject from './components/CreateProject';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import MemberLogin from './components/MemberLogin';
import MemberPanel from './components/MemberPanel';
import MemberSignup from './components/MemberSignup';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ProjectDetail from './components/ProjectDetail';
import ProjectsList from './components/ProjectsList';
import RoleBasedRoute from './components/RoleBasedRoute';
import Signup from './components/Signup';
import TaskDetail from './components/TaskDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/index.css';

const RoleRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user?.role === 'admin' ? '/admin-panel' : '/member-panel'} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/member-login" element={<MemberLogin />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route path="/member-signup" element={<MemberSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <RoleRedirect />
            </PrivateRoute>
          } />

          <Route path="/admin-panel" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </RoleBasedRoute>
          } />

          <Route path="/member-panel" element={
            <RoleBasedRoute allowedRoles={['member']}>
              <MemberPanel />
            </RoleBasedRoute>
          } />

          <Route path="/dashboard/overview" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/projects" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <ProjectsList />
            </RoleBasedRoute>
          } />
          
          <Route path="/projects/create" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <CreateProject />
            </RoleBasedRoute>
          } />
          
          <Route path="/projects/:id" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <ProjectDetail />
            </RoleBasedRoute>
          } />
          
          <Route path="/tasks/:id" element={
            <RoleBasedRoute allowedRoles={['admin', 'member']}>
              <TaskDetail />
            </RoleBasedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

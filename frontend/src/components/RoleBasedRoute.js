import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const panelForRole = (role) => (role === 'admin' ? '/admin-panel' : '/member-panel');

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={panelForRole(user.role)} replace />;
  }

  return children;
};

export default RoleBasedRoute;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const homePath = user?.role === 'admin' ? '/admin-panel' : user ? '/member-panel' : '/';

  return (
    <div className="navbar">
      <div className="container">
        <div>
          <Link to={homePath} style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Task Manager
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin-panel">Admin Panel</Link>
              <Link to="/projects">Projects</Link>
            </>
          )}
          {user?.role === 'member' && (
            <Link to="/member-panel">My Tasks</Link>
          )}
        </div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '20px' }}>
                Hello, {user.name} <span className="badge">{user.role}</span>
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/admin-login">Admin Login</Link>
              <Link to="/member-login">Member Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

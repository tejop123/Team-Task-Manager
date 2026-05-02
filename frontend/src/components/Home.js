import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin-panel' : '/member-panel');
    }
  }, [user, navigate]);

  return (
    <div className="container">
      <div className="home-shell">
        <section className="home-hero">
          <div>
            <p className="eyebrow">Team Task Manager</p>
            <h1>Choose your workspace</h1>
            <p className="hero-copy">
              Admins manage members, projects, and assignments. Members see only their own work.
            </p>
          </div>
          <div className="home-actions">
            <Link className="btn btn-primary" to="/admin-login">Admin Login</Link>
            <Link className="btn btn-secondary" to="/member-login">Member Login</Link>
          </div>
        </section>

        <div className="grid-2">
          <div className="card role-card">
            <h2>Admin Panel</h2>
            <p>View members, create projects, assign tasks, and manage every task in your projects.</p>
            <div className="role-actions">
              <Link className="btn btn-primary" to="/admin-signup">Admin Sign Up</Link>
              <Link className="btn btn-secondary" to="/admin-login">Login</Link>
            </div>
          </div>

          <div className="card role-card">
            <h2>Member Panel</h2>
            <p>View assigned tasks, open task details, and mark work as completed.</p>
            <div className="role-actions">
              <Link className="btn btn-primary" to="/member-signup">Member Sign Up</Link>
              <Link className="btn btn-secondary" to="/member-login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

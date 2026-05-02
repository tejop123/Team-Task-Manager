import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await taskService.getDashboard();
      setDashboard(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard');
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  const stats = dashboard?.stats || {};

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>Welcome, {user?.name}!</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-3">
        <div className="card">
          <h3>Total Tasks</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
            {stats.totalTasks}
          </p>
        </div>
        <div className="card">
          <h3>In Progress</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0dcaf0' }}>
            {stats.inProgressTasks}
          </p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#198754' }}>
            {stats.completedTasks}
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: '20px' }}>
        <div className="card">
          <h3>To Do</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6c757d' }}>
            {stats.todoTasks}
          </p>
        </div>
        <div className="card">
          <h3>On Hold</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.onHoldTasks}
          </p>
        </div>
        <div className="card">
          <h3>Overdue</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.overdueTasks}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <div className="card-header">
          <h2>Your Assigned Tasks</h2>
        </div>
        
        {dashboard?.assignedTasks.length === 0 ? (
          <p>No tasks assigned to you.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.assignedTasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.name}</td>
                  <td><span className={`badge badge-status-${task.status}`}>{task.status}</span></td>
                  <td><span className={`badge badge-priority-${task.priority}`}>{task.priority}</span></td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

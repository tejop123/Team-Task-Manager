import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';

const MemberPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError('');
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId) => {
    setUpdatingId(taskId);
    setError('');
    setSuccess('');

    try {
      await taskService.updateTask(taskId, { status: 'completed' });
      setSuccess('Task marked as completed');
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task');
    } finally {
      setUpdatingId('');
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  const completedCount = tasks.filter((task) => task.status === 'completed').length;
  const openCount = tasks.length - completedCount;

  return (
    <div className="container">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Member Panel</p>
          <h1>My Tasks</h1>
          <p className="hero-copy">Welcome, {user?.name}</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="grid-3">
        <div className="stat-card">
          <span className="stat-label">Assigned</span>
          <span className="stat-value">{tasks.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Open</span>
          <span className="stat-value">{openCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedCount}</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2>Assigned Tasks</h2>
        </div>
        {tasks.length === 0 ? (
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.name || '-'}</td>
                  <td><span className={`badge badge-status-${task.status}`}>{task.status}</span></td>
                  <td><span className={`badge badge-priority-${task.priority}`}>{task.priority}</span></td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => navigate(`/tasks/${task._id}`)}>
                      View
                    </button>
                    {task.status !== 'completed' && (
                      <button
                        className="btn btn-primary"
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleComplete(task._id)}
                        disabled={updatingId === task._id}
                      >
                        {updatingId === task._id ? 'Saving...' : 'Complete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MemberPanel;

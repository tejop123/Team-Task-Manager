import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';

const emptyTaskForm = {
  title: '',
  description: '',
  projectId: '',
  assignedTo: '',
  priority: 'medium',
  dueDate: ''
};

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setError('');
      const [dashboardResponse, membersResponse, projectsResponse, tasksResponse] = await Promise.all([
        taskService.getDashboard(),
        authService.getMembers(),
        projectService.getProjects(),
        taskService.getTasks()
      ]);

      setDashboard(dashboardResponse.data);
      setMembers(membersResponse.data);
      setProjects(projectsResponse.data);
      setTasks(tasksResponse.data);
      setTaskForm((current) => ({
        ...current,
        projectId: current.projectId || projectsResponse.data[0]?._id || ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin panel');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        projectId: taskForm.projectId,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined,
        assignedTo: taskForm.assignedTo || undefined
      };

      await taskService.createTask(payload);
      setSuccess('Task assigned successfully');
      setTaskForm({
        ...emptyTaskForm,
        projectId: taskForm.projectId
      });
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="container">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Welcome, {user?.name}</h1>
        </div>
        <Link className="btn btn-primary" to="/projects/create">Create Project</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="grid-4">
        <div className="stat-card">
          <span className="stat-label">Members</span>
          <span className="stat-value">{members.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Projects</span>
          <span className="stat-value">{projects.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tasks</span>
          <span className="stat-value">{stats.totalTasks || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completedTasks || 0}</span>
        </div>
      </div>

      <div className="grid-2 panel-grid">
        <div className="card">
          <div className="card-header">
            <h2>Assign Task</h2>
          </div>
          {projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>
              <Link className="btn btn-primary" to="/projects/create">Create Project</Link>
            </div>
          ) : (
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Project</label>
                <select
                  value={taskForm.projectId}
                  onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                  required
                >
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows="3"
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Assigning...' : 'Assign Task'}
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Members</h2>
          </div>
          {members.length === 0 ? (
            <p>No members signed up yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Project Tasks</h2>
        </div>
        {tasks.length === 0 ? (
          <p>No tasks created yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.name || '-'}</td>
                  <td>{task.assignedTo?.name || 'Unassigned'}</td>
                  <td><span className={`badge badge-status-${task.status}`}>{task.status}</span></td>
                  <td><span className={`badge badge-priority-${task.priority}`}>{task.priority}</span></td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => navigate(`/tasks/${task._id}`)}>
                      View
                    </button>
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

export default AdminPanel;

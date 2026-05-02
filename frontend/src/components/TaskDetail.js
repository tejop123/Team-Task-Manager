import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { taskService } from '../services/taskService';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
    dueDate: ''
  });

  const fetchTask = useCallback(async () => {
    try {
      const response = await taskService.getTaskById(id);
      setTask(response.data);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        status: response.data.status,
        priority: response.data.priority,
        assignedTo: response.data.assignedTo?._id || '',
        dueDate: response.data.dueDate ? response.data.dueDate.split('T')[0] : ''
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch task');
      setLoading(false);
    }
  }, [id]);

  const fetchMembers = useCallback(async () => {
    try {
      const response = await authService.getMembers();
      setMembers(response.data);
    } catch (err) {
      setError('Failed to fetch members');
    }
  }, []);

  useEffect(() => {
    fetchTask();
    if (user?.role === 'admin') {
      fetchMembers();
    }
  }, [fetchTask, fetchMembers, user?.role]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null
      };
      const response = await taskService.updateTask(id, payload);
      setTask(response.data.task);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await taskService.updateTask(id, { status: 'completed' });
      setTask(response.data.task);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(id);
        navigate(-1);
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      {error && <div className="alert alert-error">{error}</div>}
      
      {task && (
        <div className="card">
          <div className="card-header">
            <h2>{task.title}</h2>
          </div>

          {!editing ? (
            <>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Status:</strong> <span className={`badge badge-status-${task.status}`}>{task.status}</span></p>
              <p><strong>Priority:</strong> <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span></p>
              <p><strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}</p>
              <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
              <p><strong>Created By:</strong> {task.createdBy?.name}</p>
              
              {user?.role === 'admin' ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: '10px' }}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </>
              ) : (
                task.status !== 'completed' && (
                  <button
                    className="btn btn-primary"
                    onClick={handleComplete}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Mark Completed'}
                  </button>
                )
              )}
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                ></textarea>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {members.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button"
                className="btn btn-secondary"
                style={{ marginLeft: '10px' }}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDetail;

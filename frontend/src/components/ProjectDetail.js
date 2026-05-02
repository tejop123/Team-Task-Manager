import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: ''
  });

  const fetchProject = useCallback(async () => {
    try {
      const response = await projectService.getProjectById(id);
      setProject(response.data);
    } catch (err) {
      setError('Failed to fetch project');
    }
  }, [id]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await taskService.getTasks({ projectId: id });
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
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
    fetchProject();
    fetchTasks();
    fetchMembers();
  }, [fetchProject, fetchTasks, fetchMembers]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        projectId: id,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined
      };
      // Only include assignedTo if it has a value
      if (taskForm.assignedTo) {
        taskData.assignedTo = taskForm.assignedTo;
      }
      await taskService.createTask(taskData);
      setTaskForm({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' });
      setShowTaskForm(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await taskService.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      {error && <div className="alert alert-error">{error}</div>}
      
      {project && (
        <div className="card">
          <div className="card-header">
            <h2>{project.name}</h2>
          </div>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Status:</strong> <span className="badge">{project.status}</span></p>
          <p><strong>Members:</strong> {project.members.length}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            Edit Project
          </button>
          <button 
            className="btn btn-danger" 
            style={{ marginLeft: '10px' }}
            onClick={() => {
              if (window.confirm('Delete project?')) {
                projectService.deleteProject(id).then(() => navigate('/projects'));
              }
            }}
          >
            Delete Project
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Tasks</h2>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowTaskForm(!showTaskForm)}
        >
          {showTaskForm ? 'Cancel' : 'Add Task'}
        </button>

        {showTaskForm && (
          <form onSubmit={handleAddTask} style={{ marginTop: '20px' }}>
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
              <label>Description</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                rows="4"
              ></textarea>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Assign To</label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
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
            <button type="submit" className="btn btn-primary">Create Task</button>
          </form>
        )}

        <table className="table" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.assignedTo?.name || 'Unassigned'}</td>
                <td><span className={`badge badge-status-${task.status}`}>{task.status}</span></td>
                <td><span className={`badge badge-priority-${task.priority}`}>{task.priority}</span></td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                <td>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-danger"
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetail;

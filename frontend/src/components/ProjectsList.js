import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch projects');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      {error && <div className="alert alert-error">{error}</div>}
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/projects/create')}
        >
          Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <p>No projects yet. <a href="/projects/create">Create one</a></p>
        </div>
      ) : (
        <div className="grid-4">
          {projects.map(project => (
            <div key={project._id} className="card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p><strong>Status:</strong> <span className="badge">{project.status}</span></p>
              <p><strong>Members:</strong> {project.members.length}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                View
              </button>
              <button 
                className="btn btn-danger"
                style={{ marginLeft: '10px' }}
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;

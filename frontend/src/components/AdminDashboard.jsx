import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Mail, Briefcase, X, Check, Eye, EyeOff } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Projects loading/status
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null means adding a new project
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    category: 'Web Development',
    githubLink: '',
    liveDemoLink: '',
    image: '',
    featured: false
  });
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Verify auth on mount
  useEffect(() => {
    if (!token) {
      navigate('/admin');
    } else {
      fetchProjects();
      fetchMessages();
    }
  }, [token, navigate]);

  // Compute local endpoint prefix
  const getEndpoint = (path) => {
    return window.location.port === '5173' 
      ? `http://localhost:5000${path}` 
      : path;
  };

  // Headers helper
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch(getEndpoint('/api/projects'));
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Fetch projects dashboard error:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch(getEndpoint('/api/contacts'), {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Toggle Message read status
  const handleToggleRead = async (id) => {
    try {
      const res = await fetch(getEndpoint(`/api/contacts/${id}/read`), {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const updatedMsg = await res.json();
        setMessages(messages.map(m => m._id === id ? updatedMsg : m));
      }
    } catch (err) {
      console.error('Toggle read error:', err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(getEndpoint(`/api/contacts/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(getEndpoint(`/api/projects/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Delete project error:', err);
    }
  };

  // Open Modal for adding
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      techStack: '',
      category: 'Web Development',
      githubLink: '',
      liveDemoLink: '',
      image: '',
      featured: false
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Open Modal for editing
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack,
      category: project.category,
      githubLink: project.githubLink || '',
      liveDemoLink: project.liveDemoLink || '',
      image: project.image || '',
      featured: project.featured || false
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Submit Project Form
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description || !projectForm.techStack || !projectForm.category) {
      setFormError('Please include title, description, category, and tech stack.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    // Format tech stack as array
    const formattedForm = {
      ...projectForm,
      techStack: projectForm.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      const url = editingProject 
        ? getEndpoint(`/api/projects/${editingProject._id}`) 
        : getEndpoint('/api/projects');
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formattedForm)
      });

      const data = await res.json();

      if (res.ok) {
        if (editingProject) {
          setProjects(projects.map(p => p._id === editingProject._id ? data : p));
        } else {
          setProjects([data, ...projects]);
        }
        setModalOpen(false);
      } else {
        setFormError(data.message || 'Operation failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Project form submit error:', err);
      setFormError('Connection error. Server might be offline.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm({
      ...projectForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="container">
      <div className="admin-dashboard-layout">
        <div className="admin-header-row">
          <div>
            <h1 style={{ fontSize: '2.2rem' }}>Portfolio Console</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage project catalog listings and incoming messages</p>
          </div>
          <div className="admin-tabs-row">
            <button
              onClick={() => setActiveTab('projects')}
              className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            >
              <Briefcase size={18} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            >
              <Mail size={18} />
              <span>Inbox ({messages.filter(m => !m.isRead).length})</span>
            </button>
          </div>
        </div>

        {/* PROJECTS TAB CONTENTS */}
        {activeTab === 'projects' && (
          <div className="admin-projects-section">
            <div className="section-actions-bar">
              <button onClick={handleOpenAddModal} className="btn btn-primary">
                <Plus size={18} />
                <span>Add Project</span>
              </button>
            </div>

            {projectsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                Loading projects catalogue...
              </div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                No projects found. Add your first project using the button above.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-projects-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Tech Stack</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td>
                          <img
                            src={project.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=60&q=80'}
                            alt=""
                            className="admin-table-project-thumb"
                          />
                        </td>
                        <td style={{ fontWeight: '600' }}>{project.title}</td>
                        <td>
                          <span className="tech-tag" style={{ background: 'rgba(59, 130, 246, 0.05)', color: 'var(--primary)', border: 'none' }}>
                            {project.category}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', maxWidth: '250px' }}>
                            {project.techStack.map(t => (
                              <span key={t} className="tech-tag" style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          {project.featured ? (
                            <span style={{ color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: '600' }}>
                              <Check size={16} /> Yes
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No</span>
                          )}
                        </td>
                        <td className="admin-actions-cell">
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="icon-btn icon-btn-primary"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="icon-btn icon-btn-danger"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB CONTENTS */}
        {activeTab === 'messages' && (
          <div className="admin-inbox-section">
            {messagesLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                Loading inbox messages...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                Your inbox is currently empty.
              </div>
            ) : (
              <div className="inbox-list">
                {messages.map((msg) => (
                  <div key={msg._id} className={`message-card glass-panel ${!msg.isRead ? 'unread' : ''}`}>
                    <div className="message-card-header">
                      <div className="message-sender-info">
                        <h4>{msg.name}</h4>
                        <p>{msg.email}</p>
                      </div>
                      <div className="message-meta-actions">
                        <span className="message-date-stamp">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                        
                        <button
                          onClick={() => handleToggleRead(msg._id)}
                          className="icon-btn icon-btn-primary"
                          title={msg.isRead ? 'Mark Unread' : 'Mark Read'}
                        >
                          {msg.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="icon-btn icon-btn-danger"
                          title="Delete Message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="message-body">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECT ADD/EDIT MODAL OVERLAY */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content-panel">
              <div className="modal-header-row">
                <h3 style={{ fontSize: '1.4rem' }}>
                  {editingProject ? 'Edit Project Details' : 'Add New Portfolio Project'}
                </h3>
                <X className="modal-close-btn" size={24} onClick={() => setModalOpen(false)} />
              </div>

              <form onSubmit={handleProjectSubmit}>
                <div className="modal-body-form">
                  <div className="form-field-group">
                    <label className="form-label" htmlFor="title">Project Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={projectForm.title}
                      onChange={handleFormChange}
                      placeholder="RoadSoS: Real-Time Accident Monitor"
                      className="form-input-element"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={projectForm.category}
                      onChange={handleFormChange}
                      className="form-input-element"
                      style={{ background: 'var(--glass-bg)', cursor: 'pointer' }}
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="IoT/Hardware">IoT/Hardware</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="techStack">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      id="techStack"
                      name="techStack"
                      value={projectForm.techStack}
                      onChange={handleFormChange}
                      placeholder="React, Node, Express, MongoDB"
                      className="form-input-element"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="description">Project Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={projectForm.description}
                      onChange={handleFormChange}
                      placeholder="Enter a descriptive overview of the project..."
                      className="form-input-element"
                      style={{ minHeight: '100px' }}
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="githubLink">GitHub Repository Link</label>
                    <input
                      type="url"
                      id="githubLink"
                      name="githubLink"
                      value={projectForm.githubLink}
                      onChange={handleFormChange}
                      placeholder="https://github.com/username/project"
                      className="form-input-element"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="liveDemoLink">Live Demo Link</label>
                    <input
                      type="url"
                      id="liveDemoLink"
                      name="liveDemoLink"
                      value={projectForm.liveDemoLink}
                      onChange={handleFormChange}
                      placeholder="https://project-live.vercel.app"
                      className="form-input-element"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" htmlFor="image">Project Image Link (URL or Base64)</label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={projectForm.image}
                      onChange={handleFormChange}
                      placeholder="https://images.unsplash.com/photo..."
                      className="form-input-element"
                    />
                  </div>

                  <div className="form-field-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={projectForm.featured}
                      onChange={handleFormChange}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label className="form-label" htmlFor="featured" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Mark as Featured Project (will highlight on Hero/Stats)
                    </label>
                  </div>

                  {formError && (
                    <div className="form-status-alert form-status-error">
                      {formError}
                    </div>
                  )}
                </div>

                <div className="modal-footer-row">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="btn btn-primary"
                  >
                    <span>{formSubmitting ? 'Saving...' : 'Save Project'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Search, Github, ExternalLink, RefreshCw } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Web Development', 'AI/ML', 'IoT/Hardware', 'Other'];

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Failsafe: Try relative URL first, then check localhost port if on Vite dev server
      let apiEndpoint = '/api/projects';
      if (window.location.port === '5173') {
        apiEndpoint = 'http://localhost:5000/api/projects';
      }

      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.ok ? await response.json() : [];
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Could not load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query and category
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">My Created Works</h2>

        {/* Search and Category Filter Controls */}
        <div className="projects-controls glass-panel">
          <div className="projects-search-row">
            <div className="search-input-wrapper">
              <Search className="search-input-icon" size={20} />
              <input
                type="text"
                placeholder="Search by title, description, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              onClick={fetchProjects} 
              className="icon-btn icon-btn-primary" 
              title="Refresh project list"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="projects-filter-row">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Display Grid */}
        {loading ? (
          <div className="projects-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="project-card-skeleton">
                <div className="skeleton-animation" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchProjects} className="btn btn-secondary">
              Retry Load
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            No projects found matching the criteria.
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project._id} className="project-card glass-panel">
                <div className="project-img-wrapper">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
                    alt={project.title}
                    className="project-image"
                  />
                  <span className="project-category-tag">{project.category}</span>
                </div>

                <div className="project-content">
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-desc">{project.description}</p>
                  
                  <div className="project-tech-tags">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-btn"
                      >
                        <Github size={16} />
                        <span>Source Code</span>
                      </a>
                    )}
                    {project.liveDemoLink && (
                      <a
                        href={project.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-btn"
                      >
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;

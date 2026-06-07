import React, { useState, useEffect } from 'react';
import { Eye, Github, Code, CheckSquare } from 'lucide-react';

const StatsSection = () => {
  const [visitorCount, setVisitorCount] = useState(1024);
  const [gitHubRepos, setGitHubRepos] = useState(14);
  const [gitHubFollowers, setGitHubFollowers] = useState(25);

  const fetchStats = async () => {
    try {
      // Increment visitor counter on load
      let incrementEndpoint = '/api/stats/increment';
      if (window.location.port === '5173') {
        incrementEndpoint = 'http://localhost:5000/api/stats/increment';
      }
      
      const res = await fetch(incrementEndpoint, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setVisitorCount(data.visitorCount);
      }
    } catch (err) {
      console.warn('Could not increment visitor counter API:', err.message);
    }

    try {
      // Fetch GitHub stats dynamically
      const githubRes = await fetch('https://api.github.com/users/shubham-chavan');
      if (githubRes.ok) {
        const githubData = await githubRes.json();
        if (githubData.public_repos !== undefined) {
          setGitHubRepos(githubData.public_repos);
        }
        if (githubData.followers !== undefined) {
          setGitHubFollowers(githubData.followers);
        }
      }
    } catch (err) {
      console.warn('GitHub API fetch failed or rate-limited. Using default fallback metrics:', err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsItems = [
    {
      icon: <Eye size={32} />,
      value: visitorCount.toLocaleString(),
      label: 'Website Views'
    },
    {
      icon: <Github size={32} />,
      value: gitHubRepos.toString(),
      label: 'GitHub Repositories'
    },
    {
      icon: <Code size={32} />,
      value: '25k+',
      label: 'Lines of Code'
    },
    {
      icon: <CheckSquare size={32} />,
      value: '12+',
      label: 'Completed Projects'
    }
  ];

  return (
    <section className="section" style={{ background: 'rgba(0, 0, 0, 0.15)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
      <div className="container">
        <h2 className="section-title">Telemetry & Impact</h2>
        
        <div className="stats-grid">
          {statsItems.map((stat, idx) => (
            <div key={idx} className="stat-card glass-panel">
              <div className="stat-icon-row">
                {stat.icon}
              </div>
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

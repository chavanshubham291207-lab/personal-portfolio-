import React, { useEffect, useState } from 'react';
import { Layout, Database, Code, GitBranch } from 'lucide-react';

const Skills = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger progress bar filling animation after render
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const skillGroups = [
    {
      title: 'Frontend Development',
      icon: <Layout size={22} />,
      skills: [
        { name: 'React.js', level: 90 },
        { name: 'JavaScript (ES6+)', level: 85 },
        { name: 'HTML5 & CSS3', level: 95 },
      ]
    },
    {
      title: 'Backend & Databases',
      icon: <Database size={22} />,
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'Express.js', level: 80 },
        { name: 'MongoDB', level: 85 },
        { name: 'MySQL / PostgreSQL', level: 75 }
      ]
    },
    {
      title: 'Languages & AI',
      icon: <Code size={22} />,
      skills: [
        { name: 'Python', level: 80 },
        { name: 'C / C++', level: 75 },
        { name: 'Machine Learning Basics', level: 60 }
      ]
    },
    {
      title: 'DevOps & Version Control',
      icon: <GitBranch size={22} />,
      skills: [
        { name: 'Git & GitHub', level: 90 },
        { name: 'Docker', level: 65 },
        { name: 'REST APIs & Postman', level: 90 }
      ]
    }
  ];

  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">My Technical Arsenal</h2>
        
        <div className="skills-grid">
          {skillGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="skills-category-card glass-panel">
              <h3 className="skills-category-title">
                {group.icon}
                <span>{group.title}</span>
              </h3>
              
              <div className="skills-list">
                {group.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ 
                          width: animated ? `${skill.level}%` : '0%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

import React from 'react';
import { Calendar, Briefcase, Trophy, Award, Zap } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      role: 'Full Stack Web Developer Intern',
      company: 'Stitch AI Inc.',
      duration: 'May 2025 - July 2025',
      points: [
        'Built dynamic glassmorphic dashboards using React.js and Node.js for tracking IoT sensors.',
        'Optimized REST APIs reducing server response latency by 20%.',
        'Participated in daily standups and maintained version control using Git & GitHub.'
      ]
    },
    {
      role: 'Hackathon Participant / Lead Developer',
      company: 'Smart India Hackathon (SIH)',
      duration: 'December 2024',
      points: [
        'Led a 4-member team to design and build RoadSoS, a crash telemetry alert system.',
        'Engineered an Android mobile application utilizing accelerometer sensors to trigger accident notifications.',
        'Secured finalist position in the Smart Infrastructure category.'
      ]
    }
  ];

  const certifications = [
    {
      title: 'Full Stack Web Development Boot Camp',
      issuer: 'Udemy | Certificate Code: UC-9838F',
      date: 'Jan 2025',
      desc: '100+ hours of Javascript, Node.js, React.js, Express, and SQL database design.'
    },
    {
      title: 'Machine Learning Specialization',
      issuer: 'DeepLearning.AI | Coursera',
      date: 'Oct 2024',
      desc: 'Supervised Learning, neural networks, decision trees, and anomaly detection models.'
    },
    {
      title: 'Git & GitHub Professional workflow',
      issuer: 'GitHub Skills',
      date: 'Aug 2024',
      desc: 'Branching strategies, action workflows, code reviews, and remote repository commands.'
    }
  ];

  const awards = [
    {
      title: 'Academic Excellence Scholarship',
      issuer: 'MIT Academy of Engineering',
      date: 'Year 2024 & 2025',
      desc: 'Awarded for maintaining a CGPA above 9.00 in the Computer Engineering course.'
    },
    {
      title: 'Best Innovator Award (College Project Exhibition)',
      issuer: 'ABC Engineering Exhibition',
      date: 'March 2025',
      desc: 'Received 1st prize for a smart agricultural irrigation system model.'
    }
  ];

  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">Experience & Achievements</h2>

        <div className="experience-columns">
          {/* Left Column: Work & Hackathons */}
          <div className="experience-work-col">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Briefcase style={{ color: 'var(--primary)' }} />
              <span>Professional Practice</span>
            </h3>

            <div className="timeline">
              {experiences.map((exp, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-date">{exp.duration}</div>
                  <h4 className="timeline-title">{exp.role}</h4>
                  <div className="timeline-subtitle-icon timeline-subtitle">
                    <span>{exp.company}</span>
                  </div>
                  <ul className="resume-item-bullet-list">
                    {exp.points.map((p, pidx) => (
                      <li key={pidx}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Certifications & Awards */}
          <div className="experience-credentials-col">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Trophy style={{ color: 'var(--primary)' }} />
              <span>Certifications & Honors</span>
            </h3>

            <div className="achievements-list">
              <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '1rem' }}>
                Key Certifications
              </h4>
              {certifications.map((cert, idx) => (
                <div key={idx} className="achievement-card glass-panel">
                  <div className="achievement-icon-wrapper">
                    <Award size={20} />
                  </div>
                  <div className="achievement-content">
                    <h5 className="achievement-title">{cert.title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>{cert.issuer} • {cert.date}</p>
                    <p className="achievement-desc">{cert.desc}</p>
                  </div>
                </div>
              ))}

              <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '1rem', marginTop: '1.5rem' }}>
                Awards & Prizes
              </h4>
              {awards.map((award, idx) => (
                <div key={idx} className="achievement-card glass-panel">
                  <div className="achievement-icon-wrapper">
                    <Zap size={20} />
                  </div>
                  <div className="achievement-content">
                    <h5 className="achievement-title">{award.title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>{award.issuer} • {award.date}</p>
                    <p className="achievement-desc">{award.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

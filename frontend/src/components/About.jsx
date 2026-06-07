import React from 'react';
import { BookOpen, GraduationCap, Briefcase, Award } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        
        <div className="about-grid">
          <div className="about-intro">
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Who I Am</h3>
            <p>
              I am Shubham Chavan, a dedicated Computer Engineering student with a passion for designing and building software solutions. My academic curriculum has equipped me with strong analytical skills and a firm understanding of algorithms, data structures, and computer network architecture.
            </p>
            <p>
              Beyond the classroom, I devote my time to practical application. I specialize in building web systems using Node.js and React, and developing edge artificial intelligence models. I love hardware prototyping, integrating ESP32 modules, and writing telemetry aggregators.
            </p>
            
            <div className="objective-box">
              <strong>Career Objective:</strong> To leverage my programming capabilities and engineering background in a dynamic software development role, creating high-impact digital applications while expanding my skill set in machine learning and cloud infrastructures.
            </div>
          </div>

          <div className="about-education-timeline">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '2.0rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <GraduationCap style={{ color: 'var(--primary)' }} />
              <span>Education & Milestones</span>
            </h3>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-date">2023 - 2027 (Expected)</div>
                <h4 className="timeline-title">B.E. in Computer Engineering</h4>
                <p className="timeline-subtitle">Savtribai Phule Pune University | MIT Academy of Engineering</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Focusing on Advanced Algorithms, Database Systems, Computer Networks, and AI Foundations. Current CGPA: 9.12 / 10.00
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-date">2021 - 2023</div>
                <h4 className="timeline-title">Higher Secondary Certificate (HSC)</h4>
                <p className="timeline-subtitle">Maharashtra State Board | Jai Hind Junior College</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Completed science stream with Physics, Chemistry, and Mathematics focus. Secured 89.50% in board examination.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-date">Summer 2025</div>
                <h4 className="timeline-title">Full Stack Developer Intern</h4>
                <p className="timeline-subtitle">Stitch AI Inc.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Designed prototype interfaces for smart city telemetry dashboards. Integrated React frontends with Express.js APIs and managed state variables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

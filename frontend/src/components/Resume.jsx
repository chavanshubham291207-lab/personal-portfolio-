import React from 'react';
import { Download, FileText, Phone, Mail, Globe, MapPin } from 'lucide-react';

const Resume = () => {
  const handlePrint = () => {
    // Elegant way to download: triggers print layout of the resume mockup
    window.print();
  };

  return (
    <section id="resume" className="section">
      <div className="container">
        <h2 className="section-title">Academic Resume</h2>
        
        <div className="resume-preview-container">
          <div className="section-actions-bar">
            <button onClick={handlePrint} className="btn btn-primary">
              <Download size={18} />
              <span>Download PDF / Print</span>
            </button>
          </div>

          {/* Interactive Mock PDF Sheet */}
          <div className="resume-paper-preview glass-panel">
            <div className="resume-header">
              <h3>Shubham Chavan</h3>
              <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1.1rem' }}>Computer Engineering Student</p>
              
              <div className="resume-header-links">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Phone size={14} /> +91 98765 43210
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Mail size={14} /> shubham.chavan@u.mitaoe.ac.in
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Globe size={14} /> shubham-chavan.github.io
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <MapPin size={14} /> Pune, India
                </span>
              </div>
            </div>

            {/* Career Objective */}
            <div className="resume-section-block">
              <h4 className="resume-section-title">Career Objective</h4>
              <p>
                Highly motivated Computer Engineering undergraduate with hands-on expertise in full-stack JavaScript (React, Node, Express, MongoDB) and embedded IoT development. Seeking a software developer position to build scalable systems, deploy AI models, and optimize hardware-software interactions.
              </p>
            </div>

            <div className="resume-grid-two">
              {/* Left Column: Education & Experience */}
              <div className="resume-section-block">
                <h4 className="resume-section-title">Education</h4>
                <div className="resume-item" style={{ marginBottom: '1rem' }}>
                  <div className="resume-item-row">
                    <span>MIT Academy of Engineering</span>
                    <span>2023 - 2027</span>
                  </div>
                  <div className="resume-item-company">B.E. in Computer Engineering</div>
                  <span style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>Current CGPA: 9.12/10.00</span>
                </div>
                <div className="resume-item">
                  <div className="resume-item-row">
                    <span>Jai Hind Junior College</span>
                    <span>2021 - 2023</span>
                  </div>
                  <div className="resume-item-company">HSC Higher Secondary Certificate</div>
                  <span style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>Science Stream | Grade: 89.50%</span>
                </div>

                <h4 className="resume-section-title" style={{ marginTop: '1.5rem' }}>Experience</h4>
                <div className="resume-item">
                  <div className="resume-item-row">
                    <span>Stitch AI Inc.</span>
                    <span>Summer 2025</span>
                  </div>
                  <div className="resume-item-company">Full Stack Web Developer Intern</div>
                  <ul className="resume-item-bullet-list" style={{ fontSize: '0.85rem' }}>
                    <li>Created modular React components for live analytics telemetry displays.</li>
                    <li>Connected Node/Express endpoints to MongoDB to retrieve real-time alerts.</li>
                    <li>Integrated WebSocket handlers to render flash messages on device signals.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Skills & Projects */}
              <div className="resume-section-block">
                <h4 className="resume-section-title">Technical Skills</h4>
                <p>
                  <strong>Frontend:</strong> React.js, JavaScript (ES6), HTML5, CSS3, JSON<br />
                  <strong>Backend:</strong> Node.js, Express.js, REST APIs, WebSockets<br />
                  <strong>Databases:</strong> MongoDB, Mongoose, MySQL, PostgreSQL<br />
                  <strong>Languages:</strong> Python, C/C++, JavaScript<br />
                  <strong>Dev Tools:</strong> Git, GitHub, Docker, Postman, Linux, VS Code
                </p>

                <h4 className="resume-section-title" style={{ marginTop: '1.5rem' }}>Key Projects</h4>
                <div className="resume-item" style={{ marginBottom: '1rem' }}>
                  <div className="resume-item-row">
                    <strong>RoadSoS Accident Alert</strong>
                    <span>React, Node, Mongoose</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Accident alert tracker using mobile accelerometer values to send incident telemetry (coordinates, impact severity) to a control dispatch station in real-time.
                  </p>
                </div>
                <div className="resume-item">
                  <div className="resume-item-row">
                    <strong>IoT Smart Irrigation</strong>
                    <span>ESP32, React, C++, MQTT</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Automated irrigation grid model using telemetry sensors, microcontrollers, and light dashboards to check humidity levels and toggle water pumps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;

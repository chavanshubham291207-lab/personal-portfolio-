import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const endorsements = [
    {
      name: 'Dr. Vinay Kulkarni',
      role: 'Head of Computer Engineering, MITAOE',
      text: 'Shubham is an exceptionally analytical student. His leadership in developing the SIH RoadSoS crash detection prototype demonstrated outstanding engineering principles and teamwork.',
      avatarInitials: 'VK'
    },
    {
      name: 'Sameer Joshi',
      role: 'Senior Software Architect, Stitch AI',
      text: 'During his summer internship, Shubham demonstrated quick learning and high initiative. He successfully built a responsive analytics board and integrated MongoDB pipelines without hand-holding.',
      avatarInitials: 'SJ'
    },
    {
      name: 'Prof. Anjali Sharma',
      role: 'Department Project Mentor',
      text: 'Shubham\'s smart agriculture irrigation prototype was a brilliant showcase of embedded programming. His dedication to calibrating sensor values for accurate auto-triggers is highly commendable.',
      avatarInitials: 'AS'
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Academic & Professional Feedback</h2>
        
        <div className="testimonials-slider">
          <div className="testimonials-grid">
            {endorsements.map((item, idx) => (
              <div key={idx} className="testimonial-card glass-panel">
                <Quote className="testimonial-quote-icon" size={32} />
                <p className="testimonial-text">"{item.text}"</p>
                <div className="testimonial-author-row">
                  <div className="testimonial-avatar">
                    {item.avatarInitials}
                  </div>
                  <div className="testimonial-meta">
                    <span className="testimonial-name">{item.name}</span>
                    <span className="testimonial-role">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

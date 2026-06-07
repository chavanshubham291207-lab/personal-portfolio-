import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      let submitEndpoint = '/api/contacts';
      if (window.location.port === '5173') {
        submitEndpoint = 'http://localhost:5000/api/contacts';
      }

      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: 'success',
          text: 'Thank you! Your message has been sent successfully. Check your email for confirmation.'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          text: data.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setStatus({
        type: 'error',
        text: 'Connection failed. The backend API server might be offline.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        
        <div className="contact-grid">
          {/* Left Side: Contact details */}
          <div className="contact-info-panel">
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Contact Information</h3>
            <p className="contact-intro-text">
              Have an exciting project idea, internship opening, or just want to chat about engineering? Drop me a message and I'll get back to you within 24 hours.
            </p>
            
            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-detail-content">
                  <h4>Email</h4>
                  <p>shubham.chavan@u.mitaoe.ac.in</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-detail-content">
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-detail-content">
                  <h4>Location</h4>
                  <p>Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="contact-socials-row">
              <a 
                href="https://www.linkedin.com/in/shubham-chavan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-circle-link"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/shubham-chavan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-circle-link"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:shubham.chavan@u.mitaoe.ac.in" 
                className="social-circle-link"
                title="Email Direct"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Right Side: Contact form */}
          <div className="contact-form-container glass-panel">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-field-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input-element"
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="form-input-element"
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="form-input-element"
                  required
                />
              </div>

              {status && (
                <div className={`form-status-alert ${status.type === 'success' ? 'form-status-success' : 'form-status-error'}`}>
                  {status.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Send size={18} />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

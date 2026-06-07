import React, { useState, useEffect } from 'react';
import { Briefcase, MessageSquare, Terminal } from 'lucide-react';

const Hero = () => {
  const words = ['Computer Engineering Student', 'Full Stack Developer', 'AI Enthusiast'];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer;
    const fullWord = words[currentWordIdx];

    const handleType = () => {
      if (!isDeleting) {
        // Typing characters
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullWord) {
          // Pause at full word before starting to delete
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        // Deleting characters
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, typingSpeed]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-info">
            <span className="hero-hello">Hello, I'm</span>
            <h1 className="hero-title">Shubham Chavan</h1>
            
            <div className="hero-tagline">
              <span>I am a </span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                {currentText}
                <span className="typing-cursor">|</span>
              </span>
            </div>

            <p className="hero-description">
              Passionate about building scalable web applications, exploring deep learning models, and designing smart IoT systems. Currently pursuing my Computer Engineering degree and looking for opportunities to innovate.
            </p>

            <div className="hero-cta">
              <button 
                onClick={() => scrollToSection('projects')} 
                className="btn btn-primary"
              >
                <Briefcase size={18} />
                <span>View Projects</span>
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="btn btn-secondary"
              >
                <MessageSquare size={18} />
                <span>Contact Me</span>
              </button>
            </div>
          </div>

          <div className="hero-image-container">
            <div className="profile-placeholder-glow">
              {/* Graphic SVG Placeholder */}
              <svg 
                className="profile-avatar-svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M12 2v4M12 6H8m4 0h4" />
                <path d="M7 22v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                <circle cx="12" cy="11" r="3" />
                <path d="m19 19-2.5-2.5M5 19l2.5-2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

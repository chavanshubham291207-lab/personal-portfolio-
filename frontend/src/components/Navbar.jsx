import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('adminToken');
  const adminUsername = localStorage.getItem('adminUsername') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page switch
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/#home' },
    { name: 'About', path: '/#about' },
    { name: 'Skills', path: '/#skills' },
    { name: 'Projects', path: '/#projects' },
    { name: 'Experience', path: '/#experience' },
    { name: 'Resume', path: '/#resume' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isAdminPage = location.pathname.startsWith('/admin');

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/' + id);
      return;
    }
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => scrollToSection('#home')}>
          Shubham<span>.C</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          {!isAdminPage ? (
            navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.path.replace('/', ''));
                }}
                className="navbar-link"
              >
                {link.name}
              </a>
            ))
          ) : (
            <Link to="/" className="navbar-link">View Portfolio</Link>
          )}

          {token && (
            <Link to="/admin/dashboard" className="navbar-link admin-indicator">
              <User size={16} />
              <span>{adminUsername}</span>
            </Link>
          )}

          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {token && (
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={20} />
            </button>
          )}

          {!token && !isAdminPage && (
            <Link to="/admin" className="btn btn-secondary admin-login-btn">
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="navbar-mobile-controls">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar-toggle"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <div className={`navbar-mobile-menu ${isOpen ? 'open' : ''}`}>
        {!isAdminPage ? (
          navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.path.replace('/', ''));
              }}
              className="navbar-mobile-link"
            >
              {link.name}
            </a>
          ))
        ) : (
          <Link to="/" className="navbar-mobile-link">View Portfolio</Link>
        )}

        {token && (
          <Link to="/admin/dashboard" className="navbar-mobile-link admin-indicator">
            <User size={18} />
            <span>{adminUsername} Dashboard</span>
          </Link>
        )}

        {!token && !isAdminPage && (
          <Link to="/admin" className="navbar-mobile-link admin-login-link">
            Admin Panel
          </Link>
        )}

        {token && (
          <button onClick={handleLogout} className="navbar-mobile-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

// We will add specific CSS styles for the navbar in index.css shortly or append it here.
export default Navbar;

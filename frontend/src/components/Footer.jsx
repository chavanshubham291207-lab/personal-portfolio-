import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-element">
      <div className="container">
        <div className="footer-container">
          <div className="footer-logo">
            Shubham<span>.C</span>
          </div>
          
          <div className="footer-text">
            &copy; {currentYear} Shubham Chavan. All rights reserved. | Built with React, Node.js & MongoDB.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Import Layout Elements
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

// Import Portfolio Sections
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import StatsSection from './components/StatsSection';
import Testimonials from './components/Testimonials';
import Resume from './components/Resume';
import Contact from './components/Contact';

// Import Admin Pages
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// One-Page Landing Layout
const PortfolioLandingPage = () => {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <StatsSection />
      <Testimonials />
      <Resume />
      <Contact />
    </>
  );
};

// Main Routing and Layout wrapper
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          
          <main style={{ flex: '1 0 auto' }}>
            <Routes>
              {/* Public Portfolio Route */}
              <Route path="/" element={<PortfolioLandingPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Fallback Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

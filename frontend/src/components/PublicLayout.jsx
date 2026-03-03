import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

// Icon Components
const MenuIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/>
  </svg>
);

const XIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const ChevronUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 7L2 7"/>
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.69 2.81a2 2 0 0 1-.45 2.11L8 9.71a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.33 1.85.563 2.81.69A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const navClass = ({ isActive }) =>
  `relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
    isActive 
      ? 'text-blue-600 bg-blue-50' 
      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
  }`;

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Premium Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white/80 backdrop-blur-sm py-3'
      }`}>
        <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
          {/* Logo with enhanced design */}
          <Link 
            to="/" 
            className="group relative flex items-center gap-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg font-bold text-lg">
                SA
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Attendance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navClass}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/login"
              className={({ isActive }) => 
                `px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105 transition-all duration-300"
            >
              Sign Up Free
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-6 h-6 text-slate-600" />
            ) : (
              <MenuIcon className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                end={item.path === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="border-t border-slate-100 my-2"></div>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up Free
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content with padding for fixed header */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-40"
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="w-6 h-6" />
        </button>
      )}

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-16 relative">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div>
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Smart Attendance
                </span>
              </Link>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Revolutionizing workforce management with intelligent attendance solutions and real-time analytics.
              </p>
              <div className="flex gap-4">
                <SocialLink href="#" icon={FacebookIcon} label="Facebook" />
                <SocialLink href="#" icon={TwitterIcon} label="Twitter" />
                <SocialLink href="#" icon={LinkedInIcon} label="LinkedIn" />
                <SocialLink href="#" icon={GithubIcon} label="GitHub" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/services">Services</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/blog">Blog</FooterLink>
                <FooterLink to="/help">Help Center</FooterLink>
                <FooterLink to="/api">API Documentation</FooterLink>
                <FooterLink to="/status">System Status</FooterLink>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <MailIcon className="w-4 h-4 text-blue-400" />
                  <a href="mailto:support@smartattendance.local" className="hover:text-white transition-colors">
                    support@smartattendance.local
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneIcon className="w-4 h-4 text-blue-400" />
                  <a href="tel:+15551234567" className="hover:text-white transition-colors">
                    +1 (555) 123-4567
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPinIcon className="w-4 h-4 text-blue-400" />
                  <span>123 Tech Street, San Francisco, CA 94105</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h4 className="text-white font-semibold mb-2">Subscribe to our newsletter</h4>
                <p className="text-sm text-slate-400">Get the latest updates and offers delivered to your inbox.</p>
              </div>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-slate-400">
              © {new Date().getFullYear()} Smart Attendance. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all duration-300"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
      >
        {children}
      </Link>
    </li>
  );
}
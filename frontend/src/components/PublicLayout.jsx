import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronUp, Facebook, Twitter, Linkedin, Github,
  Mail, Phone, MapPin, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const navClass = ({ isActive }) =>
  `relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
    isActive
      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10'
      : 'text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-500/5'
  }`;

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { dark, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Glassy Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass shadow-lg py-2'
            : 'bg-transparent py-4'
        }`}
        style={isScrolled ? { background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-light)' } : {}}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8">
          <Logo size="sm" />

          <nav className="hidden md:flex items-center gap-1">
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

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-orange-500'
                    : 'text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10'
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign Up Free
            </NavLink>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-all"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ background: 'var(--bg-glass-strong)', backdropFilter: 'blur(24px)', borderTop: '1px solid var(--border-light)' }}
        >
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-orange-50 dark:hover:bg-orange-500/10'
                  }`
                }
                style={{ color: isMobileMenuOpen ? '' : 'var(--text-primary)' }}
                end={item.path === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div style={{ borderTop: '1px solid var(--border-light)' }} className="my-2" />
            <NavLink
              to="/login"
              className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-50 dark:hover:bg-orange-500/10"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-orange-500 text-white text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up Free
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-orange-500 text-white p-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all duration-200 z-40 hover:shadow-xl"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 dark:bg-black text-stone-300" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo size="sm" light />
              <p className="text-sm text-stone-400 mt-4 mb-4 leading-relaxed">
                Smart Attendance System — modern workforce management with intelligent attendance solutions and real-time analytics.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="bg-stone-800 dark:bg-stone-900 p-2 rounded-lg hover:bg-orange-600 transition-all duration-200"
                    aria-label={`Social link ${i + 1}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {['Home', 'Services', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-stone-400 hover:text-orange-400 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                {['Blog', 'Help Center', 'API Docs', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-stone-400 hover:text-orange-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <a href="mailto:venkatesh@aislyntech.com" className="text-stone-400 hover:text-white transition-colors">venkatesh@aislyntech.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <a href="tel:+918892209021" className="text-stone-400 hover:text-white transition-colors">+91 88922 09021</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-stone-400 text-xs leading-relaxed">No:1688, 1st floor, 18th cross, 21st Main Rd, MC Layout, Vijayanagar, Bengaluru - 560040</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <p className="text-stone-400">&copy; {new Date().getFullYear()} Smart Attendance System. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="text-stone-400 hover:text-orange-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-stone-400 hover:text-orange-400 transition-colors">Terms Policy</Link>
              <Link to="/cookies" className="text-stone-400 hover:text-orange-400 transition-colors">Cookies</Link>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

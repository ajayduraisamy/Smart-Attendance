import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/roles';

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

const DashboardIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
  </svg>
);

const AttendanceIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const LeavesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>
  </svg>
);

const ReportsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/><path d="M9 8V6"/><path d="M15 8V6"/>
  </svg>
);

const EmployeesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const DevicesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>
  </svg>
);

const OfficesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BiometricsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10"/><path d="M12 12a4 4 0 0 1 4 4v4"/><path d="M12 12a4 4 0 0 0-4 4v4"/><path d="M16 22v-2"/><path d="M8 22v-2"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive 
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isHR = user?.role === ROLES.HR;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon, show: true },
    { path: '/attendance', label: 'Attendance', icon: AttendanceIcon, show: true },
    { path: '/leaves', label: 'Leaves', icon: LeavesIcon, show: isAdmin || isHR },
    { path: '/reports', label: 'Reports', icon: ReportsIcon, show: isAdmin || isHR },
    { path: '/employees', label: 'Employees', icon: EmployeesIcon, show: isAdmin },
    { path: '/devices', label: 'Devices', icon: DevicesIcon, show: isAdmin },
    { path: '/offices', label: 'Offices', icon: OfficesIcon, show: isAdmin },
    { path: '/biometrics', label: 'Biometrics', icon: BiometricsIcon, show: isAdmin },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                  SA
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Attendance
              </span>
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.role}</div>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogoutIcon className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 pb-3">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass}
                end={item.path === '/'}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                end={item.path === '/'}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            {/* Mobile User Info */}
            {user && (
              <>
                <div className="border-t border-slate-100 my-2"></div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogoutIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Smart Attendance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
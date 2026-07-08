import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Building2, HardDrive, Users, ClipboardList,
  Clock, FileText, LogOut, Menu, X, ChevronLeft, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/roles';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-orange-500 text-white shadow-md'
      : 'text-stone-300 dark:text-stone-400 hover:bg-orange-500/10 hover:text-orange-400'
  }`;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isHR = user?.role === ROLES.HR;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/app', label: 'Dashboard', icon: LayoutDashboard, show: true, end: true },
    { path: '/app/offices', label: 'Offices', icon: Building2, show: isAdmin },
    { path: '/app/devices', label: 'Devices', icon: HardDrive, show: isAdmin },
    { path: '/app/employees', label: 'Employees', icon: Users, show: isAdmin },
    { path: '/app/employee-list', label: 'Employee List', icon: ClipboardList, show: isAdmin || isHR },
    { path: '/app/attendance', label: 'Attendance', icon: Clock, show: true },
    { path: '/app/reports', label: 'Reports', icon: FileText, show: isAdmin || isHR },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${
          isSidebarOpen || isMobileOpen ? 'w-64' : 'w-20'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'var(--sidebar-bg)' }}
      >
          <div className="flex items-center justify-between h-14 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center min-w-0">
              <Logo size="sm" linkTo={null} hideText />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md hover:shadow-orange-500/30 transition-all duration-200 hover:scale-110 lg:flex hidden ml-5"
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => setIsMobileOpen(false)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-stone-400 hover:text-white lg:hidden">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
              end={item.end}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(isSidebarOpen || isMobileOpen) && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-300 dark:text-stone-400 hover:bg-orange-500/10 hover:text-orange-400 transition-all duration-200"
          >
            {dark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
            {(isSidebarOpen || isMobileOpen) && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-300 dark:text-stone-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="fixed top-0 left-0 right-0 z-30 lg:hidden flex items-center justify-between h-14 px-4"
        style={{ background: 'var(--bg-glass-strong)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border-light)' }}
      >
        <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
          <Menu className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs">AT</div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>SAS</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Main content */}
      <main className={`flex-1 min-w-0 overflow-auto transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        <div className="lg:pt-0 pt-14">
          <div className="p-4 md:p-6 lg:p-8" style={{ maxWidth: '1440px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

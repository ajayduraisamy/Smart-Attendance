import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/roles';

// --- ICONS ---
const MenuIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>);
const XIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const DashboardIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>);
const OfficesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const DevicesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>);
const EmployeesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const AttendanceIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const LeavesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg>);
const ReportsIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2"/><circle cx="12" cy="16" r="5"/><path d="M12 11v5"/></svg>);
const BiometricsIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10"/><circle cx="12" cy="12" r="2"/></svg>);
const LogoutIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>);

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* 1. MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold">SA</div>
          <span className="font-bold text-sm">Smart Attendance</span>
        </div>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/10">
          <MenuIcon className="w-6 h-6" />
        </button>
      </header>

      {/* 2. MOBILE OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* 3. SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 bg-slate-900 text-white flex flex-col p-4 transition-all duration-300 ease-in-out z-[70] ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'} ${isSidebarOpen ? 'md:w-72' : 'md:w-20'}`}>
        
        {/* Sidebar Header - FIXED CLODED STATE UI */}
        <div className={`flex items-center mb-8 ${isSidebarOpen || isMobileOpen ? 'justify-between' : 'flex-col gap-4 justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg text-white">SA</div>
            {(isSidebarOpen || isMobileOpen) && (
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">Smart Attendance</span>
                <span className="text-[10px] text-slate-400">{user?.role}</span>
              </div>
            )}
          </div>
          
          <button onClick={() => isMobileOpen ? setIsMobileOpen(false) : toggleSidebar()} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white">
            {isMobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 mb-auto overflow-y-auto">
          <NavLink to="/app" className={linkClass} end onClick={() => setIsMobileOpen(false)}>
            <DashboardIcon className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isMobileOpen) && <span>Dashboard</span>}
          </NavLink>

          {isAdmin && (
            <>
              <NavLink to="/app/offices" className={linkClass} onClick={() => setIsMobileOpen(false)}>
                <OfficesIcon className="w-5 h-5 flex-shrink-0" />
                {(isSidebarOpen || isMobileOpen) && <span>Offices</span>}
              </NavLink>
              <NavLink to="/app/devices" className={linkClass} onClick={() => setIsMobileOpen(false)}>
                <DevicesIcon className="w-5 h-5 flex-shrink-0" />
                {(isSidebarOpen || isMobileOpen) && <span>Devices</span>}
              </NavLink>
              <NavLink to="/app/employees" className={linkClass} onClick={() => setIsMobileOpen(false)}>
                <EmployeesIcon className="w-5 h-5 flex-shrink-0" />
                {(isSidebarOpen || isMobileOpen) && <span>Employees</span>}
              </NavLink>
            </>
          )}

          <NavLink to="/app/attendance" className={linkClass} onClick={() => setIsMobileOpen(false)}>
            <AttendanceIcon className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isMobileOpen) && <span>Attendance</span>}
          </NavLink>

          {(isAdmin || isHR) && (
            <>
              <NavLink to="/app/leaves" className={linkClass} onClick={() => setIsMobileOpen(false)}>
                <LeavesIcon className="w-5 h-5 flex-shrink-0" />
                {(isSidebarOpen || isMobileOpen) && <span>Leaves</span>}
              </NavLink>
              <NavLink to="/app/reports" className={linkClass} onClick={() => setIsMobileOpen(false)}>
                <ReportsIcon className="w-5 h-5 flex-shrink-0" />
                {(isSidebarOpen || isMobileOpen) && <span>Reports</span>}
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/app/biometrics" className={linkClass} onClick={() => setIsMobileOpen(false)}>
              <BiometricsIcon className="w-5 h-5 flex-shrink-0" />
              {(isSidebarOpen || isMobileOpen) && <span>Biometrics</span>}
            </NavLink>
          )}
        </nav>

        {/* Logout Section */}
        <div className="pt-4 border-t border-white/10 mt-4">
          <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium ${!isSidebarOpen && !isMobileOpen && 'md:justify-center'}`}>
            <LogoutIcon className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-auto h-screen bg-slate-50">
        <div className="p-4 md:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
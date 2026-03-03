import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/roles';

// Icon Components (keep all your existing icon components here)
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

const ChevronLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive 
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const isHR = user?.role === ROLES.HR;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const sidebarWidth = isSidebarOpen ? 'w-72' : 'w-20';
  const showText = isSidebarOpen || isHovered;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static h-screen ${sidebarWidth} bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col p-4 gap-6 transition-all duration-300 ease-in-out z-40 ${
          isMobileMenuOpen ? 'left-0' : '-left-72 md:left-0'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!showText && 'justify-center w-full'}`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">
              SA
            </div>
            {showText && (
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Smart Attendance
                </div>
                <div className="text-xs text-slate-400 truncate max-w-[150px]">
                  {user?.email}
                </div>
              </div>
            )}
          </div>
          
          {/* Toggle Button - Always visible when sidebar is open OR when hovered in collapsed state */}
          {(isSidebarOpen || isHovered) && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <ChevronLeftIcon className="w-5 h-5" />
              ) : (
                <ChevronRightIcon className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileMenu}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          <NavLink to="/app" className={linkClass} end onClick={closeMobileMenu}>
            <DashboardIcon className="w-5 h-5 flex-shrink-0" />
            {showText && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/app/attendance" className={linkClass} onClick={closeMobileMenu}>
            <AttendanceIcon className="w-5 h-5 flex-shrink-0" />
            {showText && <span>Attendance</span>}
          </NavLink>

          {(isAdmin || isHR) && (
            <NavLink to="/app/leaves" className={linkClass} onClick={closeMobileMenu}>
              <LeavesIcon className="w-5 h-5 flex-shrink-0" />
              {showText && <span>Leaves</span>}
            </NavLink>
          )}

          {(isAdmin || isHR) && (
            <NavLink to="/app/reports" className={linkClass} onClick={closeMobileMenu}>
              <ReportsIcon className="w-5 h-5 flex-shrink-0" />
              {showText && <span>Reports</span>}
            </NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/app/employees" className={linkClass} onClick={closeMobileMenu}>
                <EmployeesIcon className="w-5 h-5 flex-shrink-0" />
                {showText && <span>Employees</span>}
              </NavLink>

              <NavLink to="/app/devices" className={linkClass} onClick={closeMobileMenu}>
                <DevicesIcon className="w-5 h-5 flex-shrink-0" />
                {showText && <span>Devices</span>}
              </NavLink>

              <NavLink to="/app/offices" className={linkClass} onClick={closeMobileMenu}>
                <OfficesIcon className="w-5 h-5 flex-shrink-0" />
                {showText && <span>Offices</span>}
              </NavLink>

              <NavLink to="/app/biometrics" className={linkClass} onClick={closeMobileMenu}>
                <BiometricsIcon className="w-5 h-5 flex-shrink-0" />
                {showText && <span>Biometrics</span>}
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <button 
          onClick={logout} 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium ${
            !showText && 'justify-center'
          }`}
        >
          <LogoutIcon className="w-5 h-5 flex-shrink-0" />
          {showText && <span>Logout</span>}
        </button>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-4 right-4 md:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg z-30"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

   
      {!isSidebarOpen && !isHovered && (
        <button
          onClick={toggleSidebar}
          className="hidden md:flex fixed left-22 top-7 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          title="Expand sidebar"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      )}

      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
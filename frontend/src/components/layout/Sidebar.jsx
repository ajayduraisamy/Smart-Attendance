import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUsers, FiSettings, FiFileText, FiCalendar, FiUser, FiBarChart2, FiPackage, FiLogOut } from 'react-icons/fi';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const iconMap = {
    home: FiHome,
    users: FiUsers,
    settings: FiSettings,
    reports: FiFileText,
    leaves: FiCalendar,
    profile: FiUser,
    analytics: FiBarChart2,
    devices: FiPackage,
  };

  const menuItems = {
    admin: [
      { label: 'Dashboard', path: '/dashboard', icon: 'home' },
      { label: 'Employees', path: '/employees', icon: 'users' },
      { label: 'Attendance', path: '/attendance', icon: 'fileText' },
      { label: 'Devices', path: '/devices', icon: 'devices' },
      { label: 'Offices', path: '/offices', icon: 'users' },
      { label: 'Users', path: '/users', icon: 'profile' },
      { label: 'Reports', path: '/reports', icon: 'analytics' },
      { label: 'Leaves', path: '/leaves', icon: 'leaves' },
      { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    hr: [
      { label: 'Dashboard', path: '/dashboard', icon: 'home' },
      { label: 'Attendance', path: '/attendance', icon: 'fileText' },
      { label: 'Employees', path: '/employees', icon: 'users' },
      { label: 'Leaves', path: '/leaves', icon: 'leaves' },
      { label: 'Reports', path: '/reports', icon: 'analytics' },
      { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    employee: [
      { label: 'Dashboard', path: '/dashboard', icon: 'home' },
      { label: 'My Attendance', path: '/attendance', icon: 'fileText' },
      { label: 'Apply Leave', path: '/leaves', icon: 'leaves' },
      { label: 'Profile', path: '/profile', icon: 'profile' },
    ],
  };

  const items = menuItems[user?.role] || menuItems.employee;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-sidebar bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SA</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Smart Attendance</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer - User Menu */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all duration-200"
        >
          <FiUser size={20} />
          <span className="font-medium text-sm">{user?.name || 'Profile'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <FiLogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
            SA
          </div>
          <h1 className="text-xl font-bold text-green-400">Smart Attendance</h1>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="text-right">
              <p className="font-semibold text-slate-100">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role || 'user'}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
              <button
                onClick={() => { navigate('/profile'); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-100"
              >
                Profile Settings
              </button>
              <button
                onClick={() => { navigate('/change-password'); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-100"
              >
                Change Password
              </button>
              <hr className="border-slate-700" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

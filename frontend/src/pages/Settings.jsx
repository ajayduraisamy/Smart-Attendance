import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Call API to change password
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">Manage account settings</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-2xl">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Password changed successfully!
            </div>
          )}

          {/* Account Info */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Account Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input type="text" value={user?.name || ''} disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <input type="text" value={user?.role || ''} disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 capitalize" />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FiLock size={20} /> Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                <input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <button type="submit" disabled={loading} className="w-full px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-600">
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

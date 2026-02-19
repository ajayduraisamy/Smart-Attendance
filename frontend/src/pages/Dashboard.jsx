import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import { FiUsers, FiCheckCircle, FiXCircle, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 2450,
    presentToday: 2180,
    absentToday: 270,
    attendanceRate: 89,
  });

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back, {user?.name || 'User'}! Here's your attendance overview.</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FiUsers}
              label="Total Employees"
              value={stats.totalEmployees}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={FiCheckCircle}
              label="Present Today"
              value={stats.presentToday}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              icon={FiXCircle}
              label="Absent Today"
              value={stats.absentToday}
              color="bg-red-100 text-red-600"
            />
            <StatCard
              icon={FiTrendingUp}
              label="Attendance Rate"
              value={`${stats.attendanceRate}%`}
              color="bg-purple-100 text-purple-600"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Attendance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Employee</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Check-in</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Check-out</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'John Doe', checkin: '08:30 AM', checkout: '05:45 PM', status: 'Present' },
                    { name: 'Jane Smith', checkin: '09:15 AM', checkout: '06:00 PM', status: 'Present' },
                    { name: 'Mike Johnson', checkin: '—', checkout: '—', status: 'Absent' },
                    { name: 'Sarah Wilson', checkin: '08:45 AM', checkout: '05:30 PM', status: 'Present' },
                  ].map((record, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900 font-medium">{record.name}</td>
                      <td className="py-3 px-4 text-slate-600">{record.checkin}</td>
                      <td className="py-3 px-4 text-slate-600">{record.checkout}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === 'Present'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

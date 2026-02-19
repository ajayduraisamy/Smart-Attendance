import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { FiSearch, FiDownload } from 'react-icons/fi';
import Button from '../components/ui/Button';

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records] = useState([
    { id: 'EMP001', name: 'John Doe', inTime: '08:30 AM', outTime: '05:45 PM', status: 'Present' },
    { id: 'EMP002', name: 'Jane Smith', inTime: '09:15 AM', outTime: '06:00 PM', status: 'Present' },
    { id: 'EMP003', name: 'Mike Johnson', inTime: '—', outTime: '—', status: 'Absent' },
  ]);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
              <p className="text-slate-600 mt-1">Track employee attendance</p>
            </div>
            <Button icon={FiDownload} variant="outline">Export</Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Check-in</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Check-out</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6 text-slate-900 font-medium">{rec.id}</td>
                    <td className="py-4 px-6 text-slate-900">{rec.name}</td>
                    <td className="py-4 px-6 text-slate-600">{rec.inTime}</td>
                    <td className="py-4 px-6 text-slate-600">{rec.outTime}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        rec.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}



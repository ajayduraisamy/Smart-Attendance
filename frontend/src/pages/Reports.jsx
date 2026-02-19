import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { FiDownload, FiFileText } from 'react-icons/fi';
import { reportService } from '../services/api';

export default function Reports() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState(null);
  const [absentList, setAbsentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [date]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const summaryData = await reportService.getDailySummary(date);
      const absent = await reportService.getAbsentList(date);
      setSummary(summaryData);
      setAbsentList(absent || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
              <p className="text-slate-600 mt-1">View daily attendance statistics</p>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Summary Stats */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Total Employees</p>
                <p className="text-3xl font-bold text-slate-900">{summary.total_employees || 0}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Present</p>
                <p className="text-3xl font-bold text-green-600">{summary.present || 0}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Absent</p>
                <p className="text-3xl font-bold text-red-600">{summary.absent || 0}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Attendance Rate</p>
                <p className="text-3xl font-bold text-blue-600">{summary.attendance_rate || 0}%</p>
              </div>
            </div>
          )}

          {/* Absent Employees Table */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Absent Employees</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-600">Loading...</div>
            ) : absentList.length === 0 ? (
              <div className="p-8 text-center text-slate-600">No absent employees today</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Employee ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {absentList.map((emp, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-6 text-slate-900 font-medium">{emp.emp_id}</td>
                      <td className="py-4 px-6 text-slate-600">{emp.emp_name}</td>
                      <td className="py-4 px-6 text-slate-600">{emp.department || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium">
              <FiDownload size={18} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium">
              <FiFileText size={18} /> Export PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { FiPlus, FiCheck, FiX } from 'react-icons/fi';

export default function Leaves() {
  const [leaves, setLeaves] = useState([
    { id: 1, emp_id: 'EMP001', name: 'John Doe', start_date: '2026-02-20', end_date: '2026-02-22', reason: 'Personal', status: 'PENDING' },
    { id: 2, emp_id: 'EMP002', name: 'Jane Smith', start_date: '2026-02-15', end_date: '2026-02-18', reason: 'Sick', status: 'APPROVED' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    emp_id: '',
    name: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const handleApplyLeave = (e) => {
    e.preventDefault();
    setLeaves([...leaves, {
      id: leaves.length + 1,
      ...formData,
      status: 'PENDING'
    }]);
    setShowModal(false);
    setFormData({ emp_id: '', name: '', start_date: '', end_date: '', reason: '' });
  };

  const handleApprove = (id) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'APPROVED' } : l));
  };

  const handleReject = (id) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l));
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Leave Management</h1>
              <p className="text-slate-600 mt-1">Request and manage leaves</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
            >
              <FiPlus size={20} /> Apply Leave
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Leave Requests Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Employee</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Start Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">End Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Reason</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6 text-slate-900 font-medium">{leave.name}</td>
                    <td className="py-4 px-6 text-slate-600">{leave.start_date}</td>
                    <td className="py-4 px-6 text-slate-600">{leave.end_date}</td>
                    <td className="py-4 px-6 text-slate-600">{leave.reason}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        leave.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {leave.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(leave.id)} className="p-2 text-green-600 hover:bg-green-50 rounded transition" title="Approve">
                            <FiCheck size={18} />
                          </button>
                          <button onClick={() => handleReject(leave.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Reject">
                            <FiX size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Apply for Leave</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
                <input type="text" value={formData.emp_id} onChange={(e) => setFormData({ ...formData, emp_id: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20 resize-none" rows="3" required />
              </div>
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium">
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

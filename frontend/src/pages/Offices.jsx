import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { FiPlus, FiX, FiTrash } from 'react-icons/fi';
import { officeService } from '../services/api';

export default function Offices() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
  });

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const data = await officeService.getAll();
      setOffices(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await officeService.create({ name: formData.name, location: formData.location });
      setShowModal(false);
      setFormData({ name: '', location: '' });
      fetchOffices();
    } catch (err) {
      setError(err.message);
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
              <h1 className="text-3xl font-bold text-slate-900">Offices</h1>
              <p className="text-slate-600 mt-1">Manage office locations</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
            >
              <FiPlus size={20} /> Add Office
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-600">Loading...</div>
            ) : offices.length === 0 ? (
              <div className="p-8 text-center text-slate-600">No offices</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Office</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Location</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offices.map((office) => (
                    <tr key={office.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-6 text-slate-900 font-medium">{office.name}</td>
                      <td className="py-4 px-6 text-slate-600">{office.location}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          office.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {office.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <FiTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="px-8 py-6 border-b border-slate-200 flex justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add Office</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Office Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { FiPlus, FiX, FiTrash } from 'react-icons/fi';
import { deviceService } from '../services/api';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    office_id: 1,
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await deviceService.getAll();
      setDevices(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await deviceService.create({ device_id: formData.device_id, office_id: formData.office_id });
      setShowModal(false);
      setFormData({ device_id: '', office_id: 1 });
      fetchDevices();
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
              <h1 className="text-3xl font-bold text-slate-900">Devices</h1>
              <p className="text-slate-600 mt-1">Manage biometric devices</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
            >
              <FiPlus size={20} /> Add Device
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
            ) : devices.length === 0 ? (
              <div className="p-8 text-center text-slate-600">No devices</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Device ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Office</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-6 text-slate-900 font-medium">{device.device_id}</td>
                      <td className="py-4 px-6 text-slate-600">{device.office_id}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          device.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {device.status ? 'Active' : 'Inactive'}
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
              <h2 className="text-xl font-bold text-slate-900">Register Device</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Device ID</label>
                <input type="text" value={formData.device_id} onChange={(e) => setFormData({ ...formData, device_id: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Office ID</label>
                <input type="number" value={formData.office_id} onChange={(e) => setFormData({ ...formData, office_id: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
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

import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function DevicesPage() {
  const [list, setList] = useState([]);
  const [offices, setOffices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadDevices = async () => {
    try {
      const res = await client.get('/devices');
      setList(res.data);
    } catch {
      setError('Failed to load devices');
    }
  };

  const loadOffices = async () => {
    try {
      const res = await client.get('/offices');
      setOffices(res.data.filter(o => o.status));
    } catch {
      setError('Failed to load offices');
    }
  };

  useEffect(() => {
    loadDevices();
    loadOffices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await client.put(`/devices/${editingId}`, {
          device_id: editingId,
          office_id: Number(officeId)
        });
      } else {
        await client.post('/devices', {
          device_id: deviceId,
          office_id: Number(officeId)
        });
      }

      resetForm();
      loadDevices();
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    }
  };

  const resetForm = () => {
    setDeviceId('');
    setOfficeId('');
    setEditingId(null);
  };

  const handleEdit = (device) => {
    setEditingId(device.device_id);
    setDeviceId(device.device_id);
    setOfficeId(device.office_id || '');
  };

  const toggleStatus = async (device) => {
    await client.put(`/devices/${device.device_id}/status?status=${!device.status}`);
    loadDevices();
  };

  const handleDelete = async (deviceId) => {
    if (!window.confirm('Are you sure?')) return;
    await client.delete(`/devices/${deviceId}`);
    loadDevices();
  };

  const getOfficeName = (id) => {
    const office = offices.find(o => o.id === id);
    return office ? office.name : '-';
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">
        Devices (Admin only)
      </h1>

      <form
        className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm"
        onSubmit={handleSubmit}
      >
        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Device ID *</span>
          <input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            required
            disabled={editingId !== null}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Office *</span>
          <select
            value={officeId}
            onChange={(e) => setOfficeId(e.target.value)}
            required
            className="rounded-md border px-3 py-2"
          >
            <option value="">Select Office</option>
            {offices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {editingId ? 'Update Device' : 'Add Device'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        )}

        {error && <p className="text-red-600 w-full">{error}</p>}
      </form>

      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Device ID</th>
              <th className="px-3 py-2">API Key</th>
              <th className="px-3 py-2">Office</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2">{d.device_id}</td>
                <td className="px-3 py-2 font-mono text-xs break-all">
                  {d.api_key}
                </td>
                <td className="px-3 py-2">
                  {getOfficeName(d.office_id)}
                </td>
                <td className="px-3 py-2">
                  {d.status ? 'Active' : 'Inactive'}
                </td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(d)}
                    className="text-yellow-600"
                  >
                    {d.status ? 'Deactivate' : 'Activate'}
                  </button>

               
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td className="px-3 py-2" colSpan={5}>
                  No devices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
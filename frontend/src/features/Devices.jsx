import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function DevicesPage() {
  const [list, setList] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await client.get('/devices');
      setList(res.data);
    } catch (err) {
      setError('Failed to load devices (admin only)');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/devices', {
        device_id: deviceId,
        office_id: officeId ? Number(officeId) : null,
      });
      setDeviceId('');
      setOfficeId('');
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create device');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Devices (Admin only)</h1>
      <form className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm" onSubmit={handleSubmit}>
        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Device ID *</span>
          <input value={deviceId} onChange={(e) => setDeviceId(e.target.value)} required className="rounded-md border px-3 py-2" />
        </label>
        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Office ID</span>
          <input value={officeId} onChange={(e) => setOfficeId(e.target.value)} className="rounded-md border px-3 py-2" />
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Device</button>
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
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2">{d.device_id}</td>
                <td className="px-3 py-2 font-mono text-xs break-all">{d.api_key}</td>
                <td className="px-3 py-2">{d.office_id ?? '-'}</td>
                <td className="px-3 py-2">{d.status ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td className="px-3 py-2" colSpan={4}>No devices</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

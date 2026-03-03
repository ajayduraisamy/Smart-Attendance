import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function OfficesPage() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await client.get('/offices');
      setList(res.data);
    } catch (err) {
      setError('Failed to load offices (admin only)');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/offices', { name, location });
      setName('');
      setLocation('');
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create office');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Offices (Admin only)</h1>
      <form className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm" onSubmit={handleSubmit}>
        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Name *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-md border px-3 py-2" />
        </label>
        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-md border px-3 py-2" />
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Office</button>
        {error && <p className="text-red-600 w-full">{error}</p>}
      </form>
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-3 py-2">{o.name}</td>
                <td className="px-3 py-2">{o.location || '-'}</td>
                <td className="px-3 py-2">{o.status ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td className="px-3 py-2" colSpan={3}>No offices</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function OfficesPage() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const res = await client.get('/offices');
      setList(res.data);
    } catch (err) {
      setError('Failed to load offices');
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setName('');
    setLocation('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await client.put(`/offices/${editingId}`, {
          name,
          location,
          status: true
        });
      } else {
        await client.post('/offices', { name, location });
      }

      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    }
  };

  const handleEdit = (office) => {
    setEditingId(office.id);
    setName(office.name);
    setLocation(office.location || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await client.delete(`/offices/${id}`);
      load();
    } catch (err) {
      setError('Failed to delete office');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">
        Offices (Admin only)
      </h1>

      <form
        className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm"
        onSubmit={handleSubmit}
      >
        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Name *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm text-slate-700 space-y-1">
          <span className="block">Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white ${
            editingId ? 'bg-yellow-600' : 'bg-blue-600'
          }`}
        >
          {editingId ? 'Update Office' : 'Add Office'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-md bg-gray-500 text-white"
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
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-3 py-2">{o.name}</td>
                <td className="px-3 py-2">{o.location || '-'}</td>
                <td className="px-3 py-2">
                  {o.status ? 'Active' : 'Inactive'}
                </td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(o)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(o.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td className="px-3 py-2" colSpan={4}>
                  No offices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
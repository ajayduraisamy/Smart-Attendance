import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ROLES } from '../config/roles';

export default function EmployeesPage() {
  const emptyForm = { emp_id: '', name: '', email: '', phone: '', position: '', joined_date: '', office_id: '' };
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.get('/employees');
      setList(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load employees (admin only)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/employees', { ...form, office_id: form.office_id ? Number(form.office_id) : null });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Employees (Admin only)</h1>
      <form className="grid gap-3 bg-white p-4 rounded-xl shadow-sm md:grid-cols-3" onSubmit={handleSubmit}>
        <Input label="Emp ID" value={form.emp_id} onChange={(v) => setForm({ ...form, emp_id: v })} required />
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Input label="Position" value={form.position} onChange={(v) => setForm({ ...form, position: v })} required />
        <Input label="Joined Date" type="date" value={form.joined_date} onChange={(v) => setForm({ ...form, joined_date: v })} required />
        <Input label="Office ID" value={form.office_id} onChange={(v) => setForm({ ...form, office_id: v })} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Employee</button>
        {error && <p className="text-red-600 col-span-3">{error}</p>}
      </form>

      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Emp ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Position</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2">Office</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="px-3 py-2">{emp.emp_id}</td>
                <td className="px-3 py-2">{emp.name}</td>
                <td className="px-3 py-2">{emp.email || '-'}</td>
                <td className="px-3 py-2">{emp.phone || '-'}</td>
                <td className="px-3 py-2">{emp.position}</td>
                <td className="px-3 py-2">{emp.joined_date}</td>
                <td className="px-3 py-2">{emp.office_id ?? '-'}</td>
                <td className="px-3 py-2">{emp.status ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
            {!loading && list.length === 0 && (
              <tr><td className="px-3 py-2" colSpan={8}>No employees</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="text-sm text-slate-700 space-y-1">
      <span className="block">{label}{required ? ' *' : ''}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2"
      />
    </label>
  );
}

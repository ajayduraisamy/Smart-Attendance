import React, { useState } from 'react';
import client from '../api/client';

export default function LeavesPage() {
  const [form, setForm] = useState({ emp_id: '', start_date: '', end_date: '', reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await client.post('/leaves/apply', {
        emp_id: Number(form.emp_id),
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason,
      });
      setMessage('Leave applied');
      setForm({ emp_id: '', start_date: '', end_date: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to apply');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Leaves</h1>
      <form className="grid gap-3 bg-white p-4 rounded-xl shadow-sm md:grid-cols-2" onSubmit={submit}>
        <Field label="Employee ID (numeric)" value={form.emp_id} onChange={(v) => setForm({ ...form, emp_id: v })} required />
        <Field label="Start Date" type="date" value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v })} required />
        <Field label="End Date" type="date" value={form.end_date} onChange={(v) => setForm({ ...form, end_date: v })} required />
        <Field label="Reason" value={form.reason} onChange={(v) => setForm({ ...form, reason: v })} required />
        {error && <p className="text-red-600 col-span-2">{error}</p>}
        {message && <p className="text-green-600 col-span-2">{message}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Apply Leave</button>
      </form>
      <p className="text-sm text-slate-600">Note: Approve/Reject APIs exist but listing leaves isn’t provided in backend; this form submits to /leaves/apply.</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="text-sm text-slate-700 space-y-1 block">
      <span className="block">{label}{required ? ' *' : ''}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-3 py-2"
      />
    </label>
  );
}

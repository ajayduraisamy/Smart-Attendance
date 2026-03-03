import React, { useState } from 'react';
import client from '../api/client';

export default function BiometricsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">Biometric Enrollment (Admin only)</h1>
      <EnrollCard
        title="RFID Enroll"
        description="Assign an RFID UID to an employee ID"
        fields={[{ key: 'emp_id', label: 'Employee ID', placeholder: 'EMP001' }, { key: 'rfid_uid', label: 'RFID UID' }]}
        endpoint="/biometrics/rfid"
      />
      <EnrollCard
        title="Fingerprint Enroll"
        description="Save fingerprint template (base64 or hex)"
        fields={[{ key: 'emp_id', label: 'Employee ID', placeholder: 'EMP001' }, { key: 'fingerprint_template', label: 'Fingerprint Template' }]}
        endpoint="/biometrics/fingerprint"
      />
      <EnrollCard
        title="Face Enroll"
        description="Save face embedding data"
        fields={[{ key: 'emp_id', label: 'Employee ID', placeholder: 'EMP001' }, { key: 'face_embedding', label: 'Face Embedding' }]}
        endpoint="/biometrics/face"
      />
    </div>
  );
}

function EnrollCard({ title, description, fields, endpoint }) {
  const initial = Object.fromEntries(fields.map((f) => [f.key, '']));
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await client.post(endpoint, form);
      setMessage('Saved');
      setForm(initial);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
        {fields.map((f) => (
          <label key={f.key} className="text-sm text-slate-700 space-y-1">
            <span className="block">{f.label}</span>
            <input
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
              required
            />
          </label>
        ))}
        {error && <p className="text-red-600 col-span-2">{error}</p>}
        {message && <p className="text-green-600 col-span-2">{message}</p>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md">{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import client from '../api/client';

export default function BiometricsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Biometric Enrollment (Admin only)</h1>
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
    <div className="card" style={{ backgroundColor: 'var(--card-bg)' }}>
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
        {fields.map((f) => (
          <label key={f.key} className="text-sm space-y-1" style={{ color: 'var(--text-primary)' }}>
            <span className="block">{f.label}</span>
            <input
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="input-field"
              required
            />
          </label>
        ))}
        {error && <p className="text-red-600 col-span-2">{error}</p>}
        {message && <p className="text-green-600 col-span-2">{message}</p>}
        <button type="submit" disabled={loading} className="btn-primary bg-gradient-to-br from-orange-500 to-amber-500">{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}

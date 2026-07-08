import React, { useState } from "react";
import client from "../api/client";

export default function ApplyLeave() {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await client.post("/leaves/apply", form);

      setMessage("Leave applied successfully");

      setForm({
        start_date: "",
        end_date: "",
        reason: ""
      });

    } catch (err) {
      setError(err.response?.data?.detail || "Leave apply failed");
    }
  };

  return (
    <div className="card" style={{ backgroundColor: 'var(--card-bg)' }}>
      <h1 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Apply Leave</h1>

      <form className="space-y-3" onSubmit={submit}>

        <Field
          label="Start Date"
          type="date"
          value={form.start_date}
          onChange={(v) => setForm({ ...form, start_date: v })}
        />

        <Field
          label="End Date"
          type="date"
          value={form.end_date}
          onChange={(v) => setForm({ ...form, end_date: v })}
        />

        <Field
          label="Reason"
          value={form.reason}
          onChange={(v) => setForm({ ...form, reason: v })}
        />

        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}

        <button className="btn-primary bg-gradient-to-br from-orange-500 to-amber-500">
          Apply Leave
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block text-sm space-y-1" style={{ color: 'var(--text-primary)' }}>
      <span>{label}</span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="input-field"
      />
    </label>
  );
}

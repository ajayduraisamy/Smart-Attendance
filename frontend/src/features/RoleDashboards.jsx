import React, { useEffect, useState } from 'react';
import client from '../api/client';

function BaseDashboard({ title }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const res = await client.get('/reports/daily-summary', { params: { report_date: today } });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load summary');
      }
    };
    load();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="col-span-3">
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-600">Today&apos;s summary (reports/daily-summary)</p>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <StatCard title="Total Employees" value={data?.total_employees ?? '-'} />
      <StatCard title="Present" value={data?.present ?? '-'} />
      <StatCard title="Absent" value={data?.absent ?? '-'} />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function AdminDashboard() {
  return <BaseDashboard title="Admin Dashboard" />;
}

export function HRDashboard() {
  return <BaseDashboard title="HR Dashboard" />;
}

export function EmployeeDashboard() {
  return <BaseDashboard title="Employee Dashboard" />;
}

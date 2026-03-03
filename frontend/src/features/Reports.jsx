import React, { useState } from 'react';
import client from '../api/client';

export default function ReportsPage() {
  const today = new Date();
  const [reportDate, setReportDate] = useState(today.toISOString().slice(0, 10));
  const [daily, setDaily] = useState(null);
  const [absent, setAbsent] = useState([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [monthly, setMonthly] = useState([]);
  const [error, setError] = useState('');

  const loadDaily = async () => {
    setError('');
    try {
      const res = await client.get('/reports/daily-summary', { params: { report_date: reportDate } });
      setDaily(res.data);
    } catch (err) {
      setError('Failed to load daily summary');
    }
  };

  const loadAbsent = async () => {
    setError('');
    try {
      const res = await client.get('/reports/absent-list', { params: { report_date: reportDate } });
      setAbsent(res.data);
    } catch (err) {
      setError('Failed to load absent list');
    }
  };

  const loadMonthly = async () => {
    setError('');
    try {
      const res = await client.get('/reports/monthly', { params: { year, month } });
      setMonthly(res.data);
    } catch (err) {
      setError('Failed to load monthly report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-sm text-slate-700 mb-1">Report Date</label>
          <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="border rounded-md px-3 py-2" />
        </div>
        <button onClick={loadDaily} className="bg-blue-600 text-white px-4 py-2 rounded-md">Daily Summary</button>
        <button onClick={loadAbsent} className="bg-slate-700 text-white px-4 py-2 rounded-md">Absent List</button>
      </div>

      {daily && (
        <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Daily Summary</h2>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat label="Date" value={daily.date} />
            <Stat label="Total" value={daily.total_employees} />
            <Stat label="Present" value={daily.present} />
            <Stat label="Absent" value={daily.absent} />
          </div>
        </div>
      )}

      <section className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Absent Employees</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Emp ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {absent.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="px-3 py-2">{emp.emp_id}</td>
                <td className="px-3 py-2">{emp.name}</td>
                <td className="px-3 py-2">{emp.position}</td>
              </tr>
            ))}
            {absent.length === 0 && (
              <tr><td className="px-3 py-2" colSpan={3}>No data</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="space-y-3 rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex gap-3 flex-wrap items-end">
          <label className="text-sm text-slate-700 space-y-1">
            <span className="block">Year</span>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="border rounded-md px-3 py-2 w-28" />
          </label>
          <label className="text-sm text-slate-700 space-y-1">
            <span className="block">Month</span>
            <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded-md px-3 py-2 w-20" />
          </label>
          <button onClick={loadMonthly} className="bg-blue-600 text-white px-4 py-2 rounded-md">Monthly Report</button>
        </div>
        <div className="overflow-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-3 py-2">Emp ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">In</th>
                <th className="px-3 py-2">Out</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((r, idx) => (
                <tr key={`${r.id}-${idx}`} className="border-t">
                  <td className="px-3 py-2">{r.emp_id}</td>
                  <td className="px-3 py-2">{r.emp_name}</td>
                  <td className="px-3 py-2">{r.date}</td>
                  <td className="px-3 py-2">{r.type}</td>
                  <td className="px-3 py-2">{r.in_time || '-'}</td>
                  <td className="px-3 py-2">{r.out_time || '-'}</td>
                </tr>
              ))}
              {monthly.length === 0 && (
                <tr><td className="px-3 py-2" colSpan={6}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

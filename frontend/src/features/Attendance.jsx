import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function AttendancePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [empId, setEmpId] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchByDate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.get(`/attendance/by-date/${date}`);
      setRecords(res.data);
    } catch (err) {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (utcString) => {
  if (!utcString || utcString === '-') return '-';
  

  const [hours, minutes] = utcString.split(':');
  const date = new Date();
  date.setUTCHours(hours, minutes);

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
  const fetchByEmp = async () => {
    if (!empId) return;
    setLoading(true);
    setError('');
    try {
      const res = await client.get(`/attendance/by-employee/${empId}`);
      setRecords(res.data);
      console.log(res.data);
    } catch (err) {
      setError('Failed to load employee attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchByDate();
   
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Attendance</h1>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm text-slate-700 mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-md px-3 py-2" />
        </div>
        <button onClick={fetchByDate} className="bg-blue-600 text-white px-4 py-2 rounded-md">Load by Date</button>
        <div>
          <label className="block text-sm text-slate-700 mb-1">Employee ID</label>
          <input value={empId} onChange={(e) => setEmpId(e.target.value)} className="border rounded-md px-3 py-2" placeholder="EMP001" />
        </div>
        <button onClick={fetchByEmp} className="bg-slate-700 text-white px-4 py-2 rounded-md">Load by Employee</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Emp ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">In</th>
              <th className="px-3 py-2">Out</th>
              
              <th className="px-3 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
        {records.map((r) => (
  <tr key={r.id} className="border-t">
    <td className="px-3 py-2">{r.emp_id}</td>
    <td className="px-3 py-2">{r.name}</td> 
    <td className="px-3 py-2">{r.date}</td>
    
   
    <td className="px-3 py-2">{formatTime(r.check_in)}</td> 
    <td className="px-3 py-2">{formatTime(r.check_out)}</td>
    
    <td className="px-3 py-2">{r.source}</td>
  </tr>
))}
            {!loading && records.length === 0 && (
              <tr><td className="px-3 py-2" colSpan={7}>No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

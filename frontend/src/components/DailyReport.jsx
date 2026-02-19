import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '../constants/endpoints';

export default function DailyReport({ date }) {
  const { request, loading, error } = useApi();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await request(
          'GET',
          API_ENDPOINTS.DAILY_SUMMARY(date)
        );
        setReport(data);
      } catch (err) {
        console.error('Failed to fetch report:', err);
      }
    };

    fetchReport();
  }, [date]);

  if (loading) return <div className="text-slate-100">Loading...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!report) return <div className="text-slate-100">No data</div>;

  return (
    <div className="bg-slate-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-green-400 mb-4">
        Daily Report - {report.date}
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded">
          <p className="text-slate-400">Total Employees</p>
          <p className="text-2xl font-bold text-blue-400">{report.total_employees}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <p className="text-slate-400">Present</p>
          <p className="text-2xl font-bold text-green-400">{report.present}</p>
        </div>

        <div className="bg-slate-800 p-4 rounded">
          <p className="text-slate-400">Absent</p>
          <p className="text-2xl font-bold text-red-400">{report.absent}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-slate-100">
          Attendance Rate: <span className="font-bold">{report.absent_rate}%</span>
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '../constants/endpoints';

export default function EmployeeList() {
  const { request, loading, error } = useApi();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await request('GET', API_ENDPOINTS.EMPLOYEES);
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div className="text-slate-100">Loading...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="bg-slate-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-green-400 mb-4">Employees</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-slate-100">
          <thead>
            <tr className="bg-slate-800">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.emp_id} className="border-b border-slate-700 hover:bg-slate-800">
                <td className="px-4 py-2">{emp.emp_id}</td>
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.department || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className={emp.status ? 'text-green-400' : 'text-red-400'}>
                    {emp.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

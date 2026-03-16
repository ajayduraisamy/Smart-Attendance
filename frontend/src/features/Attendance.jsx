import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  User, 
  X,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import client from '../api/client';

export default function AttendancePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

useEffect(() => {
  if (employees.length > 0) {
    fetchByDate();
  }
}, [employees]);

  // Filter employees based on search term
  useEffect(() => {
    if (!employees.length) return;
    
    if (searchTerm.trim() === '') {
      setFilteredEmployees([]);
    } else {
      const filtered = employees.filter(emp => 
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emp_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 10);
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const res = await client.get('/employees');
      setEmployees(res.data || []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Failed to load employee list');
    } finally {
      setEmployeesLoading(false);
    }
  };

  const fetchByDate = async () => {
    setLoading(true);
    setError('');
    setSelectedEmployee(null);
    setSearchTerm('');
    try {
      const res = await client.get(`/attendance/by-date/${date}`);
      setRecords(res.data || []);
      calculateStats(res.data || [], employees);
    } catch (err) {
      console.error('Date fetch error:', err);
      setError(err.response?.data?.detail || 'Failed to load attendance');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByEmployee = async (employee) => {
    if (!employee || !employee.emp_id) {
      setError('Invalid employee data');
      return;
    }
    
    setLoading(true);
    setError('');
    setSelectedEmployee(employee);
    setSearchTerm(employee.name || '');
    setShowEmployeeDropdown(false);
    
    try {
      console.log('Fetching attendance for employee:', employee.emp_id);
      const res = await client.get(`/attendance/by-employee/${employee.emp_id}`);
      console.log('Employee attendance response:', res.data);
      
      // Handle both array and single object responses
      const attendanceData = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
      setRecords(attendanceData);
      
      // Calculate stats for this employee
      if (attendanceData.length > 0) {
        const record = attendanceData[0];
        setStats({
          total: 1,
          present: record.check_in ? 1 : 0,
          absent: record.check_in ? 0 : 1,
          late: record.is_late ? 1 : 0
        });
      } else {
        setStats({
          total: 1,
          present: 0,
          absent: 1,
          late: 0
        });
      }
    } catch (err) {
      console.error('Employee fetch error:', err);
      setError(err.response?.data?.detail || `Failed to load attendance for ${employee.name}`);
      setRecords([]);
      setStats({
        total: 1,
        present: 0,
        absent: 1,
        late: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (attendanceRecords, allEmployees, specificEmployee = null) => {
    if (specificEmployee) {
      // For single employee view
      const record = attendanceRecords[0] || {};
      setStats({
        total: 1,
        present: record.check_in ? 1 : 0,
        absent: record.check_in ? 0 : 1,
        late: record.is_late ? 1 : 0
      });
    } else {
      // For date view
      const total = allEmployees?.length || 0;
      const presentEmployees = new Set(
  attendanceRecords
    .filter(r => r.check_in)
    .map(r => r.emp_id)
);

const present = presentEmployees.size;
      const absent = Math.max(total - present, 0);
      const late = attendanceRecords?.filter(r => r.is_late).length || 0;
      
      setStats({ total, present, absent, late });
    }
  };

  const clearSelection = () => {
    setSelectedEmployee(null);
    setSearchTerm('');
    setShowEmployeeDropdown(false);
    fetchByDate();
  };

const formatTime = (timeString) => {
  if (!timeString) return "—";

  try {
    const [hour, minute] = timeString.split(":");

    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12 || 12;

    return `${h}:${minute} ${ampm}`;
  } catch {
    return timeString;
  }
};

  const getStatusBadge = (record) => {
    if (!record.check_in) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Absent</span>;
    }
    if (record.is_late) {
      return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Late</span>;
    }
    return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Present</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Attendance Management</h1>
                <p className="text-sm text-slate-500">Track and manage employee attendance</p>
              </div>
            </div>
            
            <button 
              onClick={fetchByDate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-wrap items-end gap-4">
            {/* Date Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Select Date
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Employee Search with Autocomplete */}
            <div className="flex-[2] min-w-[300px] relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Search Employee
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowEmployeeDropdown(true);
                    if (!e.target.value) {
                      setSelectedEmployee(null);
                    }
                  }}
                  onFocus={() => setShowEmployeeDropdown(true)}
                  placeholder="Search by name, ID, or email..."
                  className="w-full pl-10 pr-10 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  disabled={employeesLoading}
                />
                {selectedEmployee && (
                  <button
                    onClick={clearSelection}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Employee Dropdown */}
              <AnimatePresence>
                {showEmployeeDropdown && searchTerm && filteredEmployees.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
                  >
                    {filteredEmployees.map((emp) => (
                      <button
                        key={emp.id || emp.emp_id}
                        onClick={() => fetchByEmployee(emp)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 border-b border-slate-100 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                          {emp.name ? emp.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{emp.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">
                            {emp.emp_id || 'No ID'} • {emp.email || 'No email'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {employeesLoading && (
                <div className="absolute right-3 top-10">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={fetchByDate}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Filter className="w-4 h-4" />
                Load by Date
              </button>
              
            
            </div>
          </div>

          {/* Selected Employee Info */}
          {selectedEmployee && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Showing attendance for: <strong>{selectedEmployee.name}</strong> ({selectedEmployee.emp_id})
              </span>
              <button 
                onClick={clearSelection}
                className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear filter
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard 
            title="Total Employees" 
            value={stats.total}
            icon={User}
            color="#6366f1"
            bgColor="bg-indigo-50"
          />
          <StatCard 
            title="Present Today" 
            value={stats.present}
            icon={CheckCircle2}
            color="#10b981"
            bgColor="bg-emerald-50"
          />
          <StatCard 
            title="Absent Today" 
            value={stats.absent}
            icon={AlertCircle}
            color="#ef4444"
            bgColor="bg-red-50"
          />
          <StatCard 
            title="Late Arrivals" 
            value={stats.late}
            icon={Clock}
            color="#f59e0b"
            bgColor="bg-amber-50"
          />
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-600 flex-1">{error}</p>
            <button 
              onClick={fetchByDate}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Attendance Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Attendance Records</h2>
            <span className="text-sm text-slate-500">
              {records.length} {records.length === 1 ? 'record' : 'records'} found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"> Scan Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  // Loading skeletons
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-32" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-24" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-16" /></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded animate-pulse w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-16" /></td>

                    </tr>
                  ))
                ) : records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id}>
  <td className="px-6 py-4">{record.name}</td>
  <td className="px-6 py-4">{record.emp_id}</td>
  <td className="px-6 py-4">{record.date}</td>
  <td className="px-6 py-4">{formatTime(record.check_in)}</td>
  <td className="px-6 py-4">{formatTime(record.check_out)}</td>

  <td className="px-6 py-4">{getStatusBadge(record)}</td>

  <td className="px-6 py-4">
    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
      {record.source}
    </span>
  </td>

  <td className="px-6 py-4">
    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
      {record.status}
    </span>
  </td>
</tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p>No attendance records found</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {selectedEmployee 
                          ? `${selectedEmployee.name} has no attendance records for this period`
                          : 'Try selecting a different date or employee'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
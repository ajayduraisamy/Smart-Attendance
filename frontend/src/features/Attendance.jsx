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

  useEffect(() => {
    fetchEmployees();
  }, []);

useEffect(() => {
  if (employees.length > 0) {
    fetchByDate();
  }
}, [employees]);

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
      
      const attendanceData = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
      setRecords(attendanceData);
      
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
      const record = attendanceRecords[0] || {};
      setStats({
        total: 1,
        present: record.check_in ? 1 : 0,
        absent: record.check_in ? 0 : 1,
        late: record.is_late ? 1 : 0
      });
    } else {
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
  if (!timeString) return "\u2014";

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-30" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Attendance Management</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track and manage employee attendance</p>
              </div>
            </div>
            
            <button 
              onClick={fetchByDate}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="card mb-8"
        >
          <div className="flex flex-wrap items-end gap-4 p-4">
            {/* Date Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                <Calendar className="w-4 h-4 inline mr-1" />
                Select Date
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="input-field"
              />
            </div>

            {/* Employee Search with Autocomplete */}
            <div className="flex-[2] min-w-[300px] relative">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                <User className="w-4 h-4 inline mr-1" />
                Search Employee
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
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
                  className="input-field pl-10 pr-10"
                  disabled={employeesLoading}
                />
                {selectedEmployee && (
                  <button
                    onClick={clearSelection}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
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
                    className="absolute z-50 w-full mt-1 rounded-lg shadow-xl max-h-80 overflow-y-auto"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px' }}
                  >
                    {filteredEmployees.map((emp) => (
                      <button
                        key={emp.id || emp.emp_id}
                        onClick={() => fetchByEmployee(emp)}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center gap-3"
                        style={{ borderBottom: '1px solid var(--border-color)' }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-medium">
                          {emp.name ? emp.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{emp.name || 'Unknown'}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {emp.emp_id || 'No ID'} &bull; {emp.email || 'No email'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {employeesLoading && (
                <div className="absolute right-3 top-10">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={fetchByDate}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="mt-4 p-3 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: 'var(--orange-bg)' }}
            >
              <User className="w-4 h-4" style={{ color: 'var(--orange-accent)' }} />
              <span className="text-sm" style={{ color: 'var(--orange-accent)' }}>
                Showing attendance for: <strong>{selectedEmployee.name}</strong> ({selectedEmployee.emp_id})
              </span>
              <button 
                onClick={clearSelection}
                className="ml-auto text-sm font-medium"
                style={{ color: 'var(--orange-accent)' }}
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
          />
          <StatCard 
            title="Present Today" 
            value={stats.present}
            icon={CheckCircle2}
          />
          <StatCard 
            title="Absent Today" 
            value={stats.absent}
            icon={AlertCircle}
          />
          <StatCard 
            title="Late Arrivals" 
            value={stats.late}
            icon={Clock}
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
          className="card overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Attendance Records</h2>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {records.length} {records.length === 1 ? 'record' : 'records'} found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: 'var(--orange-bg)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Scan Type</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-32" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                      <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-20" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                      <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-24" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                      <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-16" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                      <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-16" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                      <td className="px-6 py-4"><div className="h-6 rounded animate-pulse w-20" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                      <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-16" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>

                    </tr>
                  ))
                ) : records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id}>
  <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>{record.name}</td>
  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{record.emp_id}</td>
  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{record.date}</td>
  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{formatTime(record.check_in)}</td>
  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{formatTime(record.check_out)}</td>

  <td className="px-6 py-4">{getStatusBadge(record)}</td>

  <td className="px-6 py-4">
    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--orange-bg)', color: 'var(--orange-accent)' }}>
      {record.source}
    </span>
  </td>

  <td className="px-6 py-4">
    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--orange-bg)', color: 'var(--orange-accent)' }}>
      {record.status}
    </span>
  </td>
</tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                      <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                      <p>No attendance records found</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
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
function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card hover:shadow-md transition-all p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--orange-bg)' }}>
          <Icon className="w-5 h-5" style={{ color: 'var(--orange-accent)' }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

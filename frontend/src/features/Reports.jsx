import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  UserCheck,
  UserMinus,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  DownloadCloud,
  Printer,
  Mail,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  Loader
} from 'lucide-react';
import client from '../api/client';

export default function ReportsPage() {
  const today = new Date();
  const [reportDate, setReportDate] = useState(today.toISOString().slice(0, 10));
  const [daily, setDaily] = useState(null);
  const [absent, setAbsent] = useState([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState({
    daily: false,
    absent: false,
    monthly: false
  });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10)
  });
  const [absentFilter, setAbsentFilter] = useState('');
  const [monthlyFilter, setMonthlyFilter] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const tabs = [
    { id: 'daily', label: 'Daily Summary', icon: Calendar },
    { id: 'absent', label: 'Absent List', icon: UserMinus },
    { id: 'monthly', label: 'Monthly Report', icon: BarChart3 },
    
  ];

  const loadDaily = async () => {
    setLoading(prev => ({ ...prev, daily: true }));
    setError('');
    try {
      const res = await client.get('/reports/daily-summary', { 
        params: { report_date: reportDate } 
      });
      setDaily(res.data);
    } catch (err) {
      setError('Failed to load daily summary');
    } finally {
      setLoading(prev => ({ ...prev, daily: false }));
    }
  };

  const loadAbsent = async () => {
    setLoading(prev => ({ ...prev, absent: true }));
    setError('');
    try {
      const res = await client.get('/reports/absent-list', { 
        params: { report_date: reportDate } 
      });
      setAbsent(res.data || []);
    } catch (err) {
      setError('Failed to load absent list');
    } finally {
      setLoading(prev => ({ ...prev, absent: false }));
    }
  };

  const loadMonthly = async () => {
    setLoading(prev => ({ ...prev, monthly: true }));
    setError('');
    try {
      const res = await client.get('/reports/monthly', { 
        params: { year, month } 
      });
      setMonthly(res.data || []);
    } catch (err) {
      setError('Failed to load monthly report');
    } finally {
      setLoading(prev => ({ ...prev, monthly: false }));
    }
  };

  useEffect(() => {
    loadDaily();
    loadAbsent();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === '-') return '-';
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch {
      return timeStr;
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleExport = (type) => {
    // Implement export logic based on type
    console.log(`Exporting ${type} in ${exportFormat} format`);
    setShowExportMenu(false);
  };

  const getStatusColor = (value, threshold) => {
    if (value > threshold) return 'text-emerald-600';
    if (value < threshold) return 'text-amber-600';
    return 'text-slate-600';
  };

  const filteredAbsent = absent.filter(emp => 
    emp.name?.toLowerCase().includes(absentFilter.toLowerCase()) ||
    emp.emp_id?.toLowerCase().includes(absentFilter.toLowerCase()) ||
    emp.position?.toLowerCase().includes(absentFilter.toLowerCase())
  );

  const filteredMonthly = monthly.filter(record => 
    record.emp_name?.toLowerCase().includes(monthlyFilter.toLowerCase()) ||
    record.emp_id?.toLowerCase().includes(monthlyFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
                <p className="text-sm text-slate-500">Comprehensive attendance reports and insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Export Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
                >
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-40"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => handleExport('csv')}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm flex items-center gap-2"
                        >
                          <DownloadCloud className="w-4 h-4" />
                          Export as CSV
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Export as PDF
                        </button>
                        <button
                          onClick={() => handleExport('email')}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Email Report
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => {
                  loadDaily();
                  loadAbsent();
                  loadMonthly();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh All
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
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
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Daily Summary Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Daily Controls */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Select Date
                    </label>
                    <input 
                      type="date" 
                      value={reportDate} 
                      onChange={(e) => setReportDate(e.target.value)} 
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    onClick={loadDaily}
                    disabled={loading.daily}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                  >
                    {loading.daily ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Filter className="w-4 h-4" />
                    )}
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Daily Summary Cards */}
              {daily && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <SummaryCard
                    title="Report Date"
                    value={formatDate(daily.date)}
                    icon={Calendar}
                    color="#6366f1"
                  />
                  <SummaryCard
                    title="Total Employees"
                    value={daily.total_employees}
                    icon={Users}
                    color="#10b981"
                  />
                  <SummaryCard
                    title="Present Today"
                    value={daily.present}
                    icon={UserCheck}
                    color="#3b82f6"
                    subtitle={`${Math.round((daily.present / daily.total_employees) * 100)}% attendance`}
                  />
                  <SummaryCard
                    title="Absent Today"
                    value={daily.absent}
                    icon={UserMinus}
                    color="#ef4444"
                    subtitle={`${Math.round((daily.absent / daily.total_employees) * 100)}% absent`}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Absent List Tab */}
          {activeTab === 'absent' && (
            <motion.div
              key="absent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Absent Controls */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Select Date
                    </label>
                    <input 
                      type="date" 
                      value={reportDate} 
                      onChange={(e) => setReportDate(e.target.value)} 
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Search className="w-4 h-4 inline mr-1" />
                      Filter Employees
                    </label>
                    <input 
                      type="text"
                      value={absentFilter}
                      onChange={(e) => setAbsentFilter(e.target.value)}
                      placeholder="Search by name, ID, or position..."
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    onClick={loadAbsent}
                    disabled={loading.absent}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                  >
                    {loading.absent ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Load Absent List
                  </button>
                </div>
              </div>

              {/* Absent Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <UserMinus className="w-5 h-5 text-red-500" />
                    Absent Employees
                  </h2>
                  <span className="text-sm text-slate-500">
                    {filteredAbsent.length} {filteredAbsent.length === 1 ? 'employee' : 'employees'} absent
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
     
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {loading.absent ? (
                        [...Array(3)].map((_, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-32" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-20" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-24" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-24" /></td>
                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded animate-pulse w-20" /></td>
                          </tr>
                        ))
                      ) : filteredAbsent.length > 0 ? (
                        filteredAbsent.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white text-sm font-medium">
                                  {emp.name?.charAt(0) || '?'}
                                </div>
                                <span className="font-medium text-slate-900">{emp.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{emp.emp_id}</td>
                            <td className="px-6 py-4 text-slate-600">{emp.position || '—'}</td>
                            
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Absent
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p>No absent employees found</p>
                            <p className="text-sm text-slate-400 mt-1">All employees are present today</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Monthly Report Tab */}
          {activeTab === 'monthly' && (
            <motion.div
              key="monthly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Monthly Controls */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                    <input 
                      type="number" 
                      value={year} 
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-28 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
                    <select 
                      value={month} 
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="w-32 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>
                          {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Search className="w-4 h-4 inline mr-1" />
                      Filter Records
                    </label>
                    <input 
                      type="text"
                      value={monthlyFilter}
                      onChange={(e) => setMonthlyFilter(e.target.value)}
                      placeholder="Search by employee name or ID..."
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    onClick={loadMonthly}
                    disabled={loading.monthly}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
                  >
                    {loading.monthly ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                    Generate Monthly Report
                  </button>
                </div>
              </div>

              {/* Monthly Stats */}
              {monthly.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Records"
                    value={monthly.length}
                    icon={FileText}
                    color="#6366f1"
                  />
                  <StatCard
                    title="Present Days"
                    value={monthly.filter(r => r.type === 'present' || r.in_time).length}
                    icon={CheckCircle2}
                    color="#10b981"
                  />
                  <StatCard
                    title="Absent Days"
                    value={monthly.filter(r => r.type === 'absent' || !r.in_time).length}
                    icon={UserMinus}
                    color="#ef4444"
                  />
                  <StatCard
                    title="Late Arrivals"
                    value={monthly.filter(r => r.is_late).length}
                    icon={Clock}
                    color="#f59e0b"
                  />
                </div>
              )}

              {/* Monthly Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Monthly Attendance Records
                  </h2>
                  <span className="text-sm text-slate-500">
                    {filteredMonthly.length} records found
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {loading.monthly ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-32" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-20" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-24" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-16" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-16" /></td>
                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-16" /></td>
                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded animate-pulse w-20" /></td>
                          </tr>
                        ))
                      ) : filteredMonthly.length > 0 ? (
                        filteredMonthly.map((record, idx) => (
                          <tr key={`${record.id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                                  {record.emp_name?.charAt(0) || '?'}
                                </div>
                                <span className="font-medium text-slate-900">{record.emp_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{record.emp_id}</td>
                            <td className="px-6 py-4 text-slate-600">{formatDate(record.date)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.type === 'present' || record.in_time 
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {record.type || (record.in_time ? 'Present' : 'Absent')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-600">{formatTime(record.in_time)}</td>
                            <td className="px-6 py-4 font-mono text-slate-600">{formatTime(record.out_time)}</td>
                            <td className="px-6 py-4">
                              {record.is_late ? (
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                  Late
                                </span>
                              ) : record.in_time ? (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                  On Time
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                  Absent
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p>No records found for this period</p>
                            <p className="text-sm text-slate-400 mt-1">Try selecting a different month</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper Components
function SummaryCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
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

const handleExport = async (type) => {
  try {

    let url = ""

    if (type === "csv") {
      url = `/reports/export-csv?report_date=${reportDate}`
    }

    if (type === "pdf") {
      url = `/reports/export-pdf?report_date=${reportDate}`
    }

    const response = await client.get(url, {
      responseType: "blob"
    })

    const blob = new Blob([response.data])
    const link = document.createElement("a")

    link.href = window.URL.createObjectURL(blob)

    link.download =
      type === "csv"
        ? `attendance_${reportDate}.csv`
        : `attendance_${reportDate}.pdf`

    document.body.appendChild(link)
    link.click()
    link.remove()

  } catch (err) {
    console.error("Export failed", err)
  }

  setShowExportMenu(false)
}

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-30" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Reports & Analytics</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Comprehensive attendance reports and insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Export Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="btn-secondary"
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
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden z-40"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px' }}
                    >
                      <div className="p-2">
                        <button
                          onClick={() => handleExport('csv')}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--orange-bg)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <DownloadCloud className="w-4 h-4" />
                          Export as CSV
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--orange-bg)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <FileText className="w-4 h-4" />
                          Export as PDF
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
                className="btn-primary"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh All
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all relative ${
                  activeTab === tab.id
                    ? 'text-orange-500'
                    : ''
                }`}
                style={{
                  color: activeTab === tab.id ? 'var(--orange-accent)' : 'var(--text-muted)'
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--orange-accent)' }}
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
              <div className="card p-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Select Date
                    </label>
                    <input 
                      type="date" 
                      value={reportDate} 
                      onChange={(e) => setReportDate(e.target.value)} 
                      className="input-field"
                    />
                  </div>
                  <button 
                    onClick={loadDaily}
                    disabled={loading.daily}
                    className="btn-primary disabled:opacity-50"
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
                  />
                  <SummaryCard
                    title="Total Employees"
                    value={daily.total_employees}
                    icon={Users}
                  />
                  <SummaryCard
                    title="Present Today"
                    value={daily.present}
                    icon={UserCheck}
                    subtitle={`${Math.round((daily.present / daily.total_employees) * 100)}% attendance`}
                  />
                  <SummaryCard
                    title="Absent Today"
                    value={daily.absent}
                    icon={UserMinus}
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
              <div className="card p-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Select Date
                    </label>
                    <input 
                      type="date" 
                      value={reportDate} 
                      onChange={(e) => setReportDate(e.target.value)} 
                      className="input-field"
                    />
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      <Search className="w-4 h-4 inline mr-1" />
                      Filter Employees
                    </label>
                    <input 
                      type="text"
                      value={absentFilter}
                      onChange={(e) => setAbsentFilter(e.target.value)}
                      placeholder="Search by name, ID, or position..."
                      className="input-field"
                    />
                  </div>
                  <button 
                    onClick={loadAbsent}
                    disabled={loading.absent}
                    className="btn-primary disabled:opacity-50"
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
              <div className="card overflow-hidden">
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <UserMinus className="w-5 h-5 text-red-500" />
                    Absent Employees
                  </h2>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {filteredAbsent.length} {filteredAbsent.length === 1 ? 'employee' : 'employees'} absent
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: 'var(--orange-bg)' }}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Employee ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Position</th>
     
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {loading.absent ? (
                        [...Array(3)].map((_, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-32" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-20" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-24" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-24" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-6 rounded animate-pulse w-20" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                          </tr>
                        ))
                      ) : filteredAbsent.length > 0 ? (
                        filteredAbsent.map((emp) => (
                          <tr key={emp.id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                                  {emp.name?.charAt(0) || '?'}
                                </div>
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{emp.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{emp.emp_id}</td>
                            <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{emp.position || '\u2014'}</td>
                            
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Absent
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                            <UserCheck className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                            <p>No absent employees found</p>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>All employees are present today</p>
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
              <div className="card p-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Year</label>
                    <input 
                      type="number" 
                      value={year} 
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="input-field w-28"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Month</label>
                    <select 
                      value={month} 
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="input-field w-32"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>
                          {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      <Search className="w-4 h-4 inline mr-1" />
                      Filter Records
                    </label>
                    <input 
                      type="text"
                      value={monthlyFilter}
                      onChange={(e) => setMonthlyFilter(e.target.value)}
                      placeholder="Search by employee name or ID..."
                      className="input-field"
                    />
                  </div>
                  <button 
                    onClick={loadMonthly}
                    disabled={loading.monthly}
                    className="btn-primary disabled:opacity-50"
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
                  />
                  <StatCard
                    title="Present Days"
                    value={monthly.filter(r => r.type === 'present' || r.in_time).length}
                    icon={CheckCircle2}
                  />
                  <StatCard
                    title="Absent Days"
                    value={monthly.filter(r => r.type === 'absent' || !r.in_time).length}
                    icon={UserMinus}
                  />
                  <StatCard
                    title="Late Arrivals"
                    value={monthly.filter(r => r.is_late).length}
                    icon={Clock}
                  />
                </div>
              )}

              {/* Monthly Table */}
              <div className="card overflow-hidden">
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <BarChart3 className="w-5 h-5" style={{ color: 'var(--orange-accent)' }} />
                    Monthly Attendance Records
                  </h2>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {filteredMonthly.length} records found
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: 'var(--orange-bg)' }}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {loading.monthly ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-32" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-20" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-24" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-16" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-16" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-4 rounded animate-pulse w-16" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                            <td className="px-6 py-4"><div className="h-6 rounded animate-pulse w-20" style={{ backgroundColor: 'var(--skeleton-bg)' }} /></td>
                          </tr>
                        ))
                      ) : filteredMonthly.length > 0 ? (
                        filteredMonthly.map((record, idx) => (
                          <tr key={`${record.id}-${idx}`} className="hover:bg-orange-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-medium">
                                  {record.emp_name?.charAt(0) || '?'}
                                </div>
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{record.emp_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{record.emp_id}</td>
                            <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{formatDate(record.date)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.type === 'present' || record.in_time 
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {record.type || (record.in_time ? 'Present' : 'Absent')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono" style={{ color: 'var(--text-secondary)' }}>{formatTime(record.in_time)}</td>
                            <td className="px-6 py-4 font-mono" style={{ color: 'var(--text-secondary)' }}>{formatTime(record.out_time)}</td>
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
                          <td colSpan={7} className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                            <BarChart3 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                            <p>No records found for this period</p>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try selecting a different month</p>
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
function SummaryCard({ title, value, icon: Icon, subtitle }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="card hover:shadow-md transition-all p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--orange-bg)' }}>
          <Icon className="w-5 h-5" style={{ color: 'var(--orange-accent)' }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--orange-bg)' }}>
          <Icon className="w-4 h-4" style={{ color: 'var(--orange-accent)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

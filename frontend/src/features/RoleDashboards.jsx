import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  HardDrive, 
  Users, 
  UserCheck, 
  UserMinus,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import client from "../api/client";

// Professional color palette
const colors = {
  admin: {
    primary: "#2563eb",
    secondary: "#7c3aed",
    gradient: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
  },
  hr: {
    primary: "#0891b2",
    secondary: "#0d9488",
    gradient: "linear-gradient(135deg, #0891b2 0%, #0d9488 100%)"
  },
  employee: {
    primary: "#059669",
    secondary: "#16a34a",
    gradient: "linear-gradient(135deg, #059669 0%, #16a34a 100%)"
  }
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

function BaseDashboard({ title }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    
    setError("");

    try {
      const today = new Date().toISOString().slice(0, 10);
      const reportRes = await client.get("/reports/daily-summary", {
        params: { report_date: today }
      });

      let offices = null;
      let devices = null;

      if (title === "Admin Dashboard") {
        const [officeRes, deviceRes] = await Promise.all([
          client.get("/offices"),
          client.get("/devices")
        ]);

        offices = officeRes.data.length;
        devices = deviceRes.data.length;
      }

      setData({
        ...reportRes.data,
        offices,
        devices
      });
      
      setLastUpdated(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData(true);
  };

  const getDashboardConfig = () => {
    switch(title) {
      case "Admin Dashboard":
        return {
          color: colors.admin,
          icon: Building2,
          subtitle: "System Overview & Management"
        };
      case "HR Dashboard":
        return {
          color: colors.hr,
          icon: Users,
          subtitle: "Workforce Analytics & Tracking"
        };
      case "Employee Dashboard":
        return {
          color: colors.employee,
          icon: UserCheck,
          subtitle: "Personal Attendance & Stats"
        };
      default:
        return {
          color: colors.admin,
          icon: Building2,
          subtitle: "Dashboard Overview"
        };
    }
  };

  const config = getDashboardConfig();
  const Icon = config.icon;

  // Calculate attendance rate
  const attendanceRate = data?.total_employees 
    ? Math.round((data.present / data.total_employees) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Clean, no navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: config.color.gradient }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">{config.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 text-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="flex items-center gap-2 text-sm bg-slate-100 px-4 py-2 rounded-lg">
              <CalendarClock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 font-medium">{lastUpdated || '--:--:--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold text-slate-900">
            Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}
          </h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your workforce today.</p>
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
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div 
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {title === "Admin Dashboard" && (
            <>
              <StatCard 
                title="Total Offices" 
                value={data?.offices} 
                loading={loading}
                icon={Building2}
                color={colors.admin.primary}
              />
              <StatCard 
                title="Total Devices" 
                value={data?.devices} 
                loading={loading}
                icon={HardDrive}
                color={colors.admin.secondary}
              />
            </>
          )}

          <StatCard 
            title="Total Employees" 
            value={data?.total_employees} 
            loading={loading}
            icon={Users}
            color="#6366f1"
          />
          
          <StatCard 
            title="Present Today" 
            value={data?.present} 
            loading={loading}
            icon={UserCheck}
            color="#10b981"
            subtitle={`${attendanceRate}% attendance rate`}
          />
          
          <StatCard 
            title="Absent Today" 
            value={data?.absent} 
            loading={loading}
            icon={UserMinus}
            color="#ef4444"
            subtitle={`${100 - attendanceRate}% absent`}
          />
        </motion.div>

      
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, icon: Icon, color, subtitle }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <motion.div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              background: `${color}15`,
              color: color
            }}
            animate={{ 
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded animate-pulse w-3/4" />
            {subtitle && <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />}
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {value?.toLocaleString() ?? "0"}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function ActivityItem({ user, action, time, status }) {
  const getStatusIcon = () => {
    switch(status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{user}</p>
        <p className="text-sm text-slate-500">{action}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
      {getStatusIcon()}
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
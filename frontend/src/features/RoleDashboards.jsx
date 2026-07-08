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

      setData({ ...reportRes.data, offices, devices });
      setLastUpdated(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = () => { loadData(true); };

  const getDashboardConfig = () => {
    switch(title) {
      case "Admin Dashboard":
        return { icon: Building2, subtitle: "System Overview & Management" };
      case "HR Dashboard":
        return { icon: Users, subtitle: "Workforce Analytics & Tracking" };
      case "Employee Dashboard":
        return { icon: UserCheck, subtitle: "Personal Attendance & Stats" };
      default:
        return { icon: Building2, subtitle: "Dashboard Overview" };
    }
  };

  const config = getDashboardConfig();
  const Icon = config.icon;
  const attendanceRate = data?.total_employees 
    ? Math.round((data.present / data.total_employees) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="sticky top-0 z-30 border-b" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-orange-500 to-amber-500">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{config.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <CalendarClock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{lastUpdated || '--:--:--'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeInUp}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}
          </h2>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your workforce today.</p>
        </motion.div>

        {error && (
          <motion.div 
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-500 flex-1">{error}</p>
            <button 
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
            >
              Try Again
            </button>
          </motion.div>
        )}

        <motion.div 
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {title === "Admin Dashboard" && (
            <>
              <StatCard title="Total Offices" value={data?.offices} loading={loading} icon={Building2} />
              <StatCard title="Total Devices" value={data?.devices} loading={loading} icon={HardDrive} />
            </>
          )}

          <StatCard title="Total Employees" value={data?.total_employees} loading={loading} icon={Users} />
          <StatCard title="Present Today" value={data?.present} loading={loading} icon={UserCheck} subtitle={`${attendanceRate}% attendance rate`} />
          <StatCard title="Absent Today" value={data?.absent} loading={loading} icon={UserMinus} subtitle={`${100 - attendanceRate}% absent`} />
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, icon: Icon, subtitle }) {
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
      className="card overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
          <motion.div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--orange-bg)', color: 'var(--orange-accent)' }}
            animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-8 rounded animate-pulse w-3/4" style={{ backgroundColor: 'var(--skeleton-bg)' }} />
            {subtitle && <div className="h-4 rounded animate-pulse w-1/2" style={{ backgroundColor: 'var(--skeleton-bg)' }} />}
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {value?.toLocaleString() ?? "0"}
            </div>
            {subtitle && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
            )}
          </>
        )}
      </div>
    </motion.div>
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

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  HardDrive, 
  Users, 
  UserCheck, 
  UserMinus,
  CalendarClock
} from "lucide-react";
import client from "../api/client";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const statCardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

function BaseDashboard({ title }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = async () => {
    setLoading(true);
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
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getGradientByTitle = () => {
    switch(title) {
      case "Admin Dashboard":
        return "from-purple-600 via-pink-500 to-red-500";
      case "HR Dashboard":
        return "from-blue-600 via-cyan-500 to-teal-500";
      case "Employee Dashboard":
        return "from-emerald-600 via-green-500 to-lime-500";
      default:
        return "from-indigo-600 via-blue-500 to-purple-500";
    }
  };

  const getIconByTitle = () => {
    switch(title) {
      case "Admin Dashboard":
        return <Building2 className="w-6 h-6" />;
      case "HR Dashboard":
        return <Users className="w-6 h-6" />;
      case "Employee Dashboard":
        return <UserCheck className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Header with Gradient */}
      <motion.div 
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${getGradientByTitle()} p-8 shadow-xl`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {getIconByTitle()}
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold text-white"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h1>
              <motion.p 
                className="text-white/80 text-sm"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Today's system summary • {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </motion.p>
            </div>
          </div>
          
          {lastUpdated && (
            <motion.div 
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CalendarClock className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Updated {lastUpdated}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Error Message with Animation */}
      {error && (
        <motion.div 
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="text-red-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            {error}
          </p>
        </motion.div>
      )}

      {/* Stats Grid - All cards same size */}
      <motion.div 
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {title === "Admin Dashboard" && (
          <>
            <StatCard 
              title="Total Offices" 
              value={data?.offices} 
              loading={loading}
              icon={<Building2 className="w-5 h-5" />}
              gradient="from-purple-500 to-pink-500"
            />
            <StatCard 
              title="Total Devices" 
              value={data?.devices} 
              loading={loading}
              icon={<HardDrive className="w-5 h-5" />}
              gradient="from-blue-500 to-cyan-500"
            />
          </>
        )}

        <StatCard 
          title="Total Employees" 
          value={data?.total_employees} 
          loading={loading}
          icon={<Users className="w-5 h-5" />}
          gradient="from-indigo-500 to-purple-500"
        />
        
        <StatCard 
          title="Present Today" 
          value={data?.present} 
          loading={loading}
          icon={<UserCheck className="w-5 h-5" />}
          gradient="from-emerald-500 to-teal-500"
        />
        
        <StatCard 
          title="Absent Today" 
          value={data?.absent} 
          loading={loading}
          icon={<UserMinus className="w-5 h-5" />}
          gradient="from-rose-500 to-red-500"
        />
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, loading, icon, gradient }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={statCardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative rounded-xl bg-white p-5 shadow-lg border border-slate-100 overflow-hidden h-full">
        {/* Animated Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
          }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <motion.div 
              className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white shadow-lg`}
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          </div>

          {loading ? (
            <motion.div 
              className="h-8 w-16 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 0%'],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 100%'
              }}
            />
          ) : (
            <div className="flex items-end gap-2">
              <motion.p 
                className="text-3xl font-bold text-slate-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                {value ?? "0"}
              </motion.p>
            </div>
          )}
        </div>
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
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  RefreshCw, 
  LayoutDashboard,
  Building2,
  HardDrive,
  CalendarClock,
  Sparkles
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

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const today = new Date().toISOString().slice(0, 10);

      const [reportRes, officeRes, deviceRes] = await Promise.all([
        client.get("/reports/daily-summary", { params: { report_date: today } }),
        client.get("/offices"),
        client.get("/devices"),
      ]);

      setData({
        ...reportRes.data,
        offices: officeRes.data.length,
        devices: deviceRes.data.length,
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to sync latest data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Header with Animated Gradient */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute inset-0 bg-white/10 backdrop-blur-sm"
          animate={{
            background: [
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0.15)',
              'rgba(255,255,255,0.1)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute -right-10 -top-10 w-60 h-60 bg-white/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * 800,
              y: Math.random() * 200,
            }}
            animate={{
              y: [null, -20, null],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <LayoutDashboard className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <motion.div 
                className="flex items-center gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold text-white">System Overview</h1>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              
              <motion.p 
                className="text-white/90 text-sm flex items-center gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CalendarClock className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdated && (
              <motion.div 
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </motion.div>
                <span className="text-sm text-white">Last updated: {lastUpdated}</span>
              </motion.div>
            )}

            <motion.button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
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

      {/* Main Stats Cards - All same size */}
      <motion.div 
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
      {/* Animated Background Gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
      />
      
      {/* Card Content */}
      <div className="relative rounded-xl bg-white p-5 shadow-lg border border-slate-100 overflow-hidden h-full">
        {/* Animated Pattern Background */}
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

        {/* Glow Effect on Hover */}
        <motion.div 
          className="absolute -inset-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
          animate={{
            x: isHovered ? ['0%', '100%'] : '0%',
          }}
          transition={{ duration: 0.5 }}
          style={{
            filter: 'blur(20px)',
            transform: 'skewX(-20deg)',
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
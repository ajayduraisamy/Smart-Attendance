import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserMinus, RefreshCw, LayoutDashboard } from 'lucide-react';
import client from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await client.get('/reports/daily-summary', { params: { report_date: today } });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to sync latest data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg shadow-lg shadow-indigo-200 animate-pulse-slow">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              System Overview
            </h1>
          </div>
          <p className="text-sm text-slate-500">Real-time attendance insights for {new Date().toLocaleDateString()}</p>
        </div>
        
        <button 
          onClick={loadData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md hover:border-indigo-200 disabled:opacity-50 group"
        >
          <RefreshCw className={`w-4 h-4 transition-all duration-300 group-hover:text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3 shadow-sm animate-shake">
          <span className="h-2 w-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Total Employees" 
          value={data?.total_employees} 
          loading={loading}
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          gradient="from-indigo-500 to-indigo-600"
          bgGradient="from-indigo-50 to-indigo-100/50"
        />
        <StatCard 
          title="Present Today" 
          value={data?.present} 
          loading={loading}
          icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
          gradient="from-emerald-500 to-emerald-600"
          bgGradient="from-emerald-50 to-emerald-100/50"
        />
        <StatCard 
          title="Absent / On Leave" 
          value={data?.absent} 
          loading={loading}
          icon={<UserMinus className="w-6 h-6 text-rose-600" />}
          gradient="from-rose-500 to-rose-600"
          bgGradient="from-rose-50 to-rose-100/50"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, icon, gradient, bgGradient }) {
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlowPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
        }}
      />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 p-[1px] rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
           style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }}>
        <div className={`h-full w-full rounded-2xl bg-gradient-to-r ${gradient}`} />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-slate-600 transition-colors">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-16 bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse rounded" />
          ) : (
            <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent tracking-tight transition-all duration-300 group-hover:scale-105 origin-left`}>
              {value ?? '0'}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl`}>
          <div className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-3deg]">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Animated decorative background element */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
        {React.cloneElement(icon, { size: 100, className: `text-${gradient.split('-')[1]}-500` })}
      </div>

      {/* Floating particles effect on hover */}
      {isHovered && (
        <>
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-indigo-400/20 rounded-full animate-float" />
          <div className="absolute bottom-0 right-1/3 w-1.5 h-1.5 bg-emerald-400/20 rounded-full animate-float-delayed" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-rose-400/20 rounded-full animate-float-slow" />
        </>
      )}
    </div>
  );
}

// Add these animations to your global CSS or tailwind.config.js
// For tailwind.config.js, add:
// extend: {
//   animation: {
//     'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//     'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
//     'float': 'float 3s ease-in-out infinite',
//     'float-delayed': 'float 3s ease-in-out 1s infinite',
//     'float-slow': 'float 4s ease-in-out 0.5s infinite',
//   },
//   keyframes: {
//     shake: {
//       '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
//       '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
//       '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
//       '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
//     },
//     float: {
//       '0%, 100%': { transform: 'translateY(0px)' },
//       '50%': { transform: 'translateY(-10px)' },
//     },
//   },
// }
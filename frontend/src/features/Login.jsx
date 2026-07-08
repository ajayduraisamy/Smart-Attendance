import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, LogIn } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) { setEmail(savedEmail); setRememberMe(true); }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (rememberMe) localStorage.setItem('rememberedEmail', email);
    else localStorage.removeItem('rememberedEmail');
    try { await login(email, password, from); }
    catch (err) { setError(err.response?.data?.detail || 'Invalid email or password'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-200/30 to-orange-400/20 blur-3xl dark:from-orange-500/10 dark:to-orange-600/5" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-100/40 to-orange-300/20 blur-3xl dark:from-orange-500/5 dark:to-orange-600/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="card overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome Back</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Smart Attendance System — Sign in</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                  </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      required
                      className="input-field"
                      style={{ paddingLeft: '2.25rem' }}
                      placeholder="you@example.com"
                    />
                </div>
                {touched.email && !email && <p className="mt-1 text-xs text-red-500">Email is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                  </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched({ ...touched, password: true })}
                      required
                      className="input-field"
                      style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }}
                      placeholder="••••••••"
                    />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <EyeOff className="h-4 w-4" style={{ color: 'var(--text-muted)' }} /> : <Eye className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />}
                  </button>
                </div>
                {touched.password && !password && <p className="mt-1 text-xs text-red-500">Password is required</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-orange-500"
                  />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                </label>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Signing in...</span></>
                ) : ('Sign in')}
              </button>
            </form>
          </div>

          <div className="px-8 py-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-light)' }}>
            <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">Create one</Link>
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-light)' }}>
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your session is protected with enterprise-grade security. We encrypt your data in transit and at rest.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

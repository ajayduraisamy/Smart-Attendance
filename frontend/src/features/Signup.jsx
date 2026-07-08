import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Briefcase, Eye, EyeOff, CheckCircle, Shield } from 'lucide-react';
import client from '../api/client';
import { ROLES } from '../config/roles';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: ROLES.ADMIN });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[a-z]/.test(form.password)) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^a-zA-Z0-9]/.test(form.password)) s++;
    setPasswordStrength(s);
  }, [form.password]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters long'); return; }
    setLoading(true);
    try {
      await client.post('/users/register', { name: form.name, email: form.email, password: form.password, role: form.role });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) { setError(err.response?.data?.detail || 'Signup failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const getStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
    return colors[passwordStrength - 1] || 'bg-stone-200 dark:bg-stone-600';
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-200/30 to-orange-400/20 blur-3xl dark:from-orange-500/10 dark:to-orange-600/5" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-100/40 to-orange-300/20 blur-3xl dark:from-orange-500/5 dark:to-orange-600/5" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-lg">
        <div className="card overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Smart Attendance System</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4" style={{ color: 'var(--text-muted)' }} /></div>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={() => setTouched({ ...touched, name: true })} required className="input-field" style={{ paddingLeft: '2.25rem' }} placeholder="Enter your name" />
                </div>
                {touched.name && !form.name && <p className="mt-1 text-xs text-red-500">Name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4" style={{ color: 'var(--text-muted)' }} /></div>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => setTouched({ ...touched, email: true })} required className="input-field" style={{ paddingLeft: '2.25rem' }} placeholder="Enter your email" />
                </div>
                {touched.email && !form.email && <p className="mt-1 text-xs text-red-500">Email is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} /></div>
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onBlur={() => setTouched({ ...touched, password: true })} required className="input-field" style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <EyeOff className="h-4 w-4" style={{ color: 'var(--text-muted)' }} /> : <Eye className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Strength</span>
                      <span className={`text-xs font-medium ${passwordStrength >= 4 ? 'text-emerald-600 dark:text-emerald-400' : ''}`} style={{ color: 'var(--text-secondary)' }}>
                        {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || 'Very Weak'}
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-primary)' }}>
                      <div className={`h-full ${getStrengthColor()} transition-all duration-300 rounded-full`} style={{ width: `${(passwordStrength / 5) * 100}%` }} />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        { label: '8+ characters', check: form.password.length >= 8 },
                        { label: 'Lowercase', check: /[a-z]/.test(form.password) },
                        { label: 'Uppercase', check: /[A-Z]/.test(form.password) },
                        { label: 'Number', check: /[0-9]/.test(form.password) },
                      ].map((item) => (
                        <p key={item.label} className={`flex items-center gap-1 text-xs ${item.check ? 'text-emerald-600 dark:text-emerald-400' : ''}`} style={{ color: item.check ? undefined : 'var(--text-muted)' }}>
                          <CheckCircle className="w-3 h-3" />{item.label}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} /></div>
                  <input type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} onBlur={() => setTouched({ ...touched, confirmPassword: true })} required className="input-field" style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }} placeholder="Confirm your password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" style={{ color: 'var(--text-muted)' }} /> : <Eye className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Role <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: ROLES.ADMIN, label: 'Admin', icon: User },
                    { value: ROLES.HR, label: 'HR', icon: Briefcase },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const selected = form.role === opt.value;
                    return (
                      <button key={opt.value} type="button" onClick={() => setForm({ ...form, role: opt.value })}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                          selected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                            : 'hover:border-orange-200 dark:hover:border-orange-500/30'
                        }`}
                        style={{ borderColor: selected ? undefined : 'var(--border-primary)', color: selected ? undefined : 'var(--text-secondary)' }}
                      >
                        <Icon className={`w-4 h-4 ${selected ? 'text-orange-500' : ''}`} style={{ color: selected ? undefined : 'var(--text-muted)' }} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Creating account...</span></>
                ) : ('Create account')}
              </button>
            </form>
          </div>

          <div className="px-8 py-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-light)' }}>
            <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { ROLES } from '../config/roles';

// Icon Components
const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 7L2 7"/>
  </svg>
);

const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const BriefcaseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: ROLES.ADMIN 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({});

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (form.password.length >= 8) strength++;
    if (form.password.match(/[a-z]/)) strength++;
    if (form.password.match(/[A-Z]/)) strength++;
    if (form.password.match(/[0-9]/)) strength++;
    if (form.password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [form.password]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await client.post('/users/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const getPasswordStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength - 1] || 'Very Weak';
  };

  const getPasswordStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return colors[passwordStrength - 1] || 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-md mx-auto">
       

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <BriefcaseIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-600 mt-2">
              Get started with Smart Attendance
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={submit}>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={() => handleBlur('name')}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    touched.name && !form.name ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {touched.name && !form.name && (
                <p className="mt-1 text-xs text-red-500">Name is required</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={() => handleBlur('email')}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    touched.email && !form.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {touched.email && !form.email && (
                <p className="mt-1 text-xs text-red-500">Email is required</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onBlur={() => handleBlur('password')}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {form.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength >= 4 ? 'text-green-600' : 'text-slate-600'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li className={`flex items-center gap-1 ${form.password.length >= 8 ? 'text-green-600' : 'text-slate-400'}`}>
                      <CheckCircleIcon className="w-3 h-3" /> At least 8 characters
                    </li>
                    <li className={`flex items-center gap-1 ${/[a-z]/.test(form.password) ? 'text-green-600' : 'text-slate-400'}`}>
                      <CheckCircleIcon className="w-3 h-3" /> One lowercase letter
                    </li>
                    <li className={`flex items-center gap-1 ${/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-slate-400'}`}>
                      <CheckCircleIcon className="w-3 h-3" /> One uppercase letter
                    </li>
                    <li className={`flex items-center gap-1 ${/[0-9]/.test(form.password) ? 'text-green-600' : 'text-slate-400'}`}>
                      <CheckCircleIcon className="w-3 h-3" /> One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  onBlur={() => handleBlur('confirmPassword')}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-500'
                      : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: ROLES.ADMIN })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    form.role === ROLES.ADMIN
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <UserIcon className={`w-6 h-6 mx-auto mb-2 ${
                    form.role === ROLES.ADMIN ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    form.role === ROLES.ADMIN ? 'text-blue-600' : 'text-slate-600'
                  }`}>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: ROLES.HR })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    form.role === ROLES.HR
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <BriefcaseIcon className={`w-6 h-6 mx-auto mb-2 ${
                    form.role === ROLES.HR ? 'text-purple-600' : 'text-slate-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    form.role === ROLES.HR ? 'text-purple-600' : 'text-slate-600'
                  }`}>HR</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-slate-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
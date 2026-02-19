import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
setLoading(true);
  try {
    // 1. Axios puts the response body in .data automatically
    const response = await Api.post('/users/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

   
    navigate('/login', { 
      state: { message: 'Registration successful! Please login.' } 
    });

  } catch (error) {
    
    const errorMessage = error.response?.data?.detail || 'An error occurred. Please try again.';
    setErrors({ submit: errorMessage });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-xl mb-4">
              <span className="text-white text-2xl font-bold">SA</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Join Smart Attendance today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              icon={FiUser}
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Email Address"
              icon={FiMail}
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Password"
              icon={FiLock}
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              icon={FiLock}
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 transition-all duration-200"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {errors.submit && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{errors.submit}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={loading}
              icon={FiArrowRight}
              iconPosition="right"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-slate-200"></div>

          {/* Footer */}
          <p className="text-center text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-slate-900 font-semibold hover:text-slate-700 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Help Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

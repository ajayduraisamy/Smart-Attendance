import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // 1. Make the request
    const response = await Api.post('/users/login', formData);

    // 2. Log this to your browser console to see exactly what the backend sends!
    console.log("Backend Response:", response.data);

    // 3. Use response.data (Axios) instead of response.json()
    const data = response.data;

    if (data && data.access_token) {
      login(
        { name: data.user.name, role: data.user.role, email: data.user.email },
        data.access_token
      );
      navigate('/dashboard');
    } else {
      setError("Login succeeded but no user data was returned.");
    }
  } catch (err) {
    // 4. Extract the actual error message from the backend
    const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
    setError(msg);
  } finally {
    setLoading(false);
  }
};
  const message = location.state?.message;

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your account</p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <FiCheck size={20} className="text-green-600" />
              <p className="text-green-800 text-sm">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              icon={FiMail}
              type="email"
              placeholder="admin@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              icon={FiLock}
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={loading}
              icon={FiArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-slate-200"></div>

          {/* Footer */}
          <p className="text-center text-slate-600 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-slate-900 font-semibold hover:text-slate-700 transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Help Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Demo: Use any email and password to login
        </p>
      </div>
    </div>
  );
}
    

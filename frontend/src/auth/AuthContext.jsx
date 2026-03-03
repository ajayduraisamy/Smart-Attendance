import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ added

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false); // ✅ auth initialization finished
  }, []);

  const login = async (email, password, redirectTo = '/app') => {
    const res = await client.post('/users/login', { email, password });

    const payload = {
      id: res.data.user_id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    };

    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(payload));

    setToken(res.data.access_token);
    setUser(payload);

    navigate(redirectTo, { replace: true });
    return payload;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout }), // ✅ expose loading
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
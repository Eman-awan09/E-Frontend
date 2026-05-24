import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // checking token on mount

  // On mount — verify stored token
  useEffect(() => {
    const token = localStorage.getItem('et_token');
    if (!token) { setLoading(false); return; }

    authAPI.verify()
      .then(({ data }) => {
        if (data.valid) setUser(data.user);
        else logout();
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login(email, password);
    localStorage.setItem('et_token', data.token);
    localStorage.setItem('et_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('et_token');
    localStorage.removeItem('et_user');
    setUser(null);
  }, []);

  const register = useCallback(async (email, password, setupKey) => {
    const { data } = await authAPI.register(email, password, setupKey);
    localStorage.setItem('et_token', data.token);
    localStorage.setItem('et_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

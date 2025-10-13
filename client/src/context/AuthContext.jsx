import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loginUser,
  fetchCurrentUser,
} from "../services/api.js";

const STORAGE_KEY = "devopsapp_auth_token";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCurrentUser(token);
        if (isMounted) {
          setUser(data.user);
        }
      } catch (err) {
        console.warn("Failed to restore session", err);
        if (isMounted) {
          localStorage.removeItem(STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleLogin = async (credentials) => {
    setError(null);
    const data = await loginUser(credentials);
    setToken(data.token);
    localStorage.setItem(STORAGE_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      error,
      setError,
      login: handleLogin,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Decode JWT payload without a library and check expiry
function getValidToken() {
  const token = localStorage.getItem("certichain_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds; Date.now() is in milliseconds
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("certichain_token");
      localStorage.removeItem("certichain_admin");
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem("certichain_token");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getValidToken());
  const [admin, setAdmin] = useState(() => {
    if (!getValidToken()) return null;
    const raw = localStorage.getItem("certichain_admin");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("certichain_token", token);
    } else {
      localStorage.removeItem("certichain_token");
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem("certichain_admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("certichain_admin");
    }
  }, [admin]);

  const login = (payload) => {
    setToken(payload.token);
    setAdmin(payload.admin);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ token, admin, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

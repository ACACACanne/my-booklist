"use client";

import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState("");

  // Login + Register modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Forms
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
  });

  // Load token on mount
  useEffect(() => {
    const stored = localStorage.getItem("authToken");
    if (stored) setToken(stored);
    setReady(true);
  }, []);

  // LOGIN
  const handleLogin = async () => {
    try {
      setAuthError("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("authToken", data.token);
      setToken(data.token);
      setShowLoginModal(false);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // REGISTER
  const handleRegister = async () => {
    try {
      setAuthError("");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Auto-login after register
      localStorage.setItem("authToken", data.token);
      setToken(data.token);
      setShowRegisterModal(false);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  return {
    token,
    ready,
    authError,

    loginForm,
    registerForm,
    setLoginForm,
    setRegisterForm,

    showLoginModal,
    showRegisterModal,
    setShowLoginModal,
    setShowRegisterModal,

    handleLogin,
    handleRegister,
    handleLogout,
  };
}

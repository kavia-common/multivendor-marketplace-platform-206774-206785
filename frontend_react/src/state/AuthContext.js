import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGetJson, apiPostJson } from "../services/apiClient";

const AuthContext = createContext(null);

const ROLE_LABELS = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
};

const STORAGE_KEY = "mvmp_auth_v1";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeUser(payload) {
  // Best-effort normalization since backend payload shape may evolve.
  if (!payload) return null;
  if (payload.user && typeof payload.user === "object") return payload.user;
  return payload;
}

function inferRoleFromUser(user) {
  if (!user) return null;
  // Prefer explicit role fields if present.
  return user.role || user.userRole || user.type || user.accountType || null;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Auth state for JWT-based auth against the backend Express API.
   *
   * Stores token in localStorage so refresh persists sessions.
   */
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("customer");
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState({ state: "idle", error: null });

  // Load persisted session once.
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? safeJsonParse(raw) : null;
    if (saved?.token) {
      setToken(saved.token);
      if (saved.role) setRole(saved.role);
      if (saved.user) setUser(saved.user);
    } else {
      // Default guest UX.
      setUser({ name: "Guest" });
    }
  }, []);

  // Persist session changes.
  useEffect(() => {
    if (!token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token,
        role,
        user,
      })
    );
  }, [token, role, user]);

  const applyAuthPayload = (payload) => {
    const nextToken = payload?.token || payload?.accessToken || payload?.jwt || null;
    const nextUser = normalizeUser(payload);
    const nextRole = payload?.role || inferRoleFromUser(nextUser) || role || "customer";

    if (nextToken) setToken(nextToken);
    setUser(nextUser || { name: "Guest" });
    setRole(nextRole || "customer");
  };

  const value = useMemo(() => {
    return {
      token,
      isAuthenticated: Boolean(token),
      role,
      roleLabel: ROLE_LABELS[role] || role,
      user,

      authStatus,

      // PUBLIC_INTERFACE
      login: async ({ email, password }) => {
        /**
         * Logs in via backend: POST /api/v1/auth/login
         * Expects a token + user payload. Stores token and role.
         */
        setAuthStatus({ state: "loading", error: null });
        try {
          const payload = await apiPostJson("/api/v1/auth/login", { email, password });
          applyAuthPayload(payload);
          setAuthStatus({ state: "success", error: null });
          return payload;
        } catch (err) {
          setAuthStatus({ state: "error", error: err });
          throw err;
        }
      },

      // PUBLIC_INTERFACE
      register: async ({ name, email, password, role: requestedRole }) => {
        /**
         * Registers via backend: POST /api/v1/auth/register
         * Some backends auto-login on register; if not, call login afterwards.
         */
        setAuthStatus({ state: "loading", error: null });
        try {
          const payload = await apiPostJson("/api/v1/auth/register", {
            name,
            email,
            password,
            role: requestedRole,
          });

          // If backend returns token/user, we're authenticated.
          // If not, keep role preference for UI and return payload for further handling.
          if (payload?.token || payload?.accessToken || payload?.jwt) {
            applyAuthPayload(payload);
          } else if (requestedRole) {
            setRole(requestedRole);
          }

          setAuthStatus({ state: "success", error: null });
          return payload;
        } catch (err) {
          setAuthStatus({ state: "error", error: err });
          throw err;
        }
      },

      // PUBLIC_INTERFACE
      refreshMe: async () => {
        /**
         * Fetches current user via backend: GET /api/v1/auth/me
         * Requires Authorization header.
         */
        if (!token) {
          const e = new Error("Not authenticated");
          e.code = "NOT_AUTHENTICATED";
          throw e;
        }

        setAuthStatus({ state: "loading", error: null });
        try {
          const payload = await apiGetJson("/api/v1/auth/me", { token });
          const nextUser = normalizeUser(payload);
          const nextRole = payload?.role || inferRoleFromUser(nextUser) || role;

          setUser(nextUser || user);
          if (nextRole) setRole(nextRole);

          setAuthStatus({ state: "success", error: null });
          return payload;
        } catch (err) {
          // If token is invalid/expired, clear it.
          if (err?.status === 401 || err?.status === 403) {
            setToken(null);
            setRole("customer");
            setUser({ name: "Guest" });
          }
          setAuthStatus({ state: "error", error: err });
          throw err;
        }
      },

      // PUBLIC_INTERFACE
      logout: () => {
        /** Clears current session token and resets to guest. */
        setToken(null);
        setRole("customer");
        setUser({ name: "Guest" });
        setAuthStatus({ state: "idle", error: null });
      },

      // PUBLIC_INTERFACE
      setRole: (nextRole) => {
        /**
         * Allows switching role label in the UI.
         * If authenticated, you should prefer backend-driven role (refreshMe).
         */
        setRole(nextRole);
      },
    };
  }, [token, role, user, authStatus]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access auth state. Must be used within AuthProvider. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}

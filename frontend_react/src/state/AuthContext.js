import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const ROLE_LABELS = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
};

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Lightweight in-memory auth state (placeholder for real JWT auth integration). */
  const [role, setRole] = useState("customer");
  const [user, setUser] = useState({ name: "Guest" });

  const value = useMemo(() => {
    return {
      role,
      roleLabel: ROLE_LABELS[role] || role,
      user,
      setUser,
      // PUBLIC_INTERFACE
      setRole: (nextRole) => {
        /** Sets the current UI role (customer/vendor/admin). */
        setRole(nextRole);
      },
    };
  }, [role, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access current role/user state. Must be used within AuthProvider. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}


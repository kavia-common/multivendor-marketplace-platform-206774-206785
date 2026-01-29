import React from "react";
import { useAuth } from "../../state/AuthContext";
import { Button } from "../ui/Button";

// PUBLIC_INTERFACE
export function TopNav({ onToggleSidebar, theme, onToggleTheme }) {
  /** Top navigation bar with role switcher (placeholder for real auth) and theme toggle. */
  const { role, roleLabel, setRole, user } = useAuth();

  return (
    <header className="topnav" role="banner">
      <div className="topnav-left">
        <Button variant="ghost" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          ☰
        </Button>
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">
            MV
          </div>
          <div className="brand-text">
            <div className="brand-name">MultiVendor Marketplace</div>
            <div className="brand-tagline">Retro commerce, modern workflow</div>
          </div>
        </div>
      </div>

      <div className="topnav-right">
        <div className="role-switcher" aria-label="Role switcher">
          <span className="role-pill" title="Current role">
            {roleLabel}
          </span>
          <select
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Select role"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="user-pill" title="Signed in user (placeholder)">
          {user?.name || "Guest"}
        </div>

        <Button
          variant="secondary"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </div>
    </header>
  );
}


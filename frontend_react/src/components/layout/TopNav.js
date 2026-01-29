import React from "react";
import { useAuth } from "../../state/AuthContext";
import { Button } from "../ui/Button";

// PUBLIC_INTERFACE
export function TopNav({ onToggleSidebar, theme, onToggleTheme, onOpenAuth }) {
  /** Top navigation bar with auth actions and theme toggle. */
  const { isAuthenticated, roleLabel, user, logout, refreshMe, authStatus } = useAuth();

  const displayName = user?.name || user?.email || "Guest";

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
        <div className="role-switcher" aria-label="Role">
          <span className="role-pill" title="Role from backend">
            {roleLabel}
          </span>
        </div>

        <div className="user-pill" title="Signed in user">
          {displayName}
        </div>

        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              onClick={() => refreshMe()}
              disabled={authStatus.state === "loading"}
              aria-label="Refresh current user"
              title="GET /api/v1/auth/me"
            >
              {authStatus.state === "loading" ? "Refreshing…" : "Refresh Me"}
            </Button>
            <Button variant="secondary" onClick={logout} aria-label="Logout">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => onOpenAuth("login")} aria-label="Login">
              Login
            </Button>
            <Button variant="secondary" onClick={() => onOpenAuth("register")} aria-label="Register">
              Register
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </div>
    </header>
  );
}

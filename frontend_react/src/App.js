import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./state/AuthContext";
import { TopNav } from "./components/layout/TopNav";
import { Sidebar } from "./components/layout/Sidebar";
import { HomePage } from "./pages/HomePage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { AuthModal } from "./components/auth/AuthModal";

function PageRouter({ activeKey }) {
  const { roleLabel } = useAuth();

  const page = useMemo(() => {
    switch (activeKey) {
      case "home":
        return <HomePage />;

      case "products":
        return <PlaceholderPage title="Browse Products" description="Search, filter, and explore products across vendors." />;
      case "cart":
        return <PlaceholderPage title="Cart" description="Multi-vendor cart ready for checkout flow." />;
      case "orders":
        return <PlaceholderPage title="Orders" description="Track orders and shipments." />;

      case "vendor-store":
        return <PlaceholderPage title="My Store" description="Store profile, policies, branding, and settings." />;
      case "vendor-products":
        return <PlaceholderPage title="Product Manager" description="Create, edit, publish, and manage inventory." />;
      case "vendor-orders":
        return <PlaceholderPage title="Order Manager" description="View and fulfill orders that include your products." />;
      case "vendor-analytics":
        return <PlaceholderPage title="Sales Analytics" description="Revenue, conversion, and product performance." />;

      case "admin-users":
        return <PlaceholderPage title="User Management" description="Admin tools for customers, vendors, and roles." />;
      case "admin-vendors":
        return <PlaceholderPage title="Vendor Approval" description="Review and approve vendor/store applications." />;
      case "admin-analytics":
        return <PlaceholderPage title="Platform Analytics" description="System-wide metrics, sales, and growth." />;

      default:
        return <PlaceholderPage title={`Unknown: ${activeKey}`} description={`No page found for this key (${roleLabel}).`} />;
    }
  }, [activeKey, roleLabel]);

  return page;
}

// PUBLIC_INTERFACE
function AppShell() {
  /** Main application shell with retro styling, auth modal, and sidebar navigation. */
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeKey, setActiveKey] = useState("home");

  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="App">
      <TopNav
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
      />

      <div className="layout">
        <Sidebar isOpen={sidebarOpen} activeKey={activeKey} onNavigate={setActiveKey} />

        <main className="content" role="main">
          <PageRouter activeKey={activeKey} />
        </main>
      </div>

      <AuthModal
        isOpen={authModal.open}
        mode={authModal.mode}
        onClose={() => setAuthModal((s) => ({ ...s, open: false }))}
        onModeChange={(mode) => setAuthModal((s) => ({ ...s, mode }))}
      />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App entrypoint. Wraps the shell with global providers. */
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;

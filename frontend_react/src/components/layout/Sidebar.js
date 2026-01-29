import React from "react";
import { useAuth } from "../../state/AuthContext";

// PUBLIC_INTERFACE
export function Sidebar({ isOpen, activeKey, onNavigate }) {
  /** Sidebar navigation. Navigation is local state (no routing yet). */
  const { role } = useAuth();

  const baseItems = [
    { key: "home", label: "Home" },
    { key: "products", label: "Browse Products" },
    { key: "cart", label: "Cart" },
    { key: "orders", label: "Orders" },
  ];

  const vendorItems = [
    { key: "vendor-store", label: "My Store" },
    { key: "vendor-products", label: "Product Manager" },
    { key: "vendor-orders", label: "Order Manager" },
    { key: "vendor-analytics", label: "Sales Analytics" },
  ];

  const adminItems = [
    { key: "admin-users", label: "User Management" },
    { key: "admin-vendors", label: "Vendor Approval" },
    { key: "admin-analytics", label: "Platform Analytics" },
  ];

  const items = [
    ...baseItems,
    ...(role === "vendor" ? vendorItems : []),
    ...(role === "admin" ? adminItems : []),
  ];

  return (
    <aside className={["sidebar", isOpen ? "sidebar-open" : ""].filter(Boolean).join(" ")} aria-label="Primary">
      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.key}
            className={["nav-item", activeKey === item.key ? "nav-item-active" : ""].filter(Boolean).join(" ")}
            onClick={() => onNavigate(item.key)}
            aria-current={activeKey === item.key ? "page" : undefined}
          >
            <span className="nav-dot" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="kbd-hint">
          Tip: Role switcher changes the dashboard sections.
        </div>
      </div>
    </aside>
  );
}


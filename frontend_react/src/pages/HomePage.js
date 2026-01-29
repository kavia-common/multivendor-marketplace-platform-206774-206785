import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// PUBLIC_INTERFACE
export function HomePage() {
  /** Landing dashboard with backend connectivity check. */
  const [status, setStatus] = useState({ state: "idle", data: null, error: null });

  const loadHealth = async () => {
    setStatus({ state: "loading", data: null, error: null });
    try {
      const data = await apiFetch("/");
      setStatus({ state: "success", data, error: null });
    } catch (err) {
      setStatus({ state: "error", data: null, error: err });
    }
  };

  useEffect(() => {
    loadHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="page-grid">
        <Card
          title="Backend Status"
          subtitle="Connectivity check (GET /)"
          actions={<Button variant="ghost" onClick={loadHealth}>Refresh</Button>}
        >
          {status.state === "loading" ? (
            <p className="muted">Checking service health…</p>
          ) : status.state === "error" ? (
            <div>
              <p className="error-text">Could not reach backend.</p>
              <pre className="code-block">{String(status.error?.message || status.error)}</pre>
              <p className="muted">
                Ensure the backend is running and set <code>REACT_APP_API_BASE_URL</code> if needed.
              </p>
            </div>
          ) : status.state === "success" ? (
            <div>
              <p className="success-text">Connected.</p>
              <pre className="code-block">{JSON.stringify(status.data, null, 2)}</pre>
            </div>
          ) : (
            <p className="muted">Idle</p>
          )}
        </Card>

        <Card title="Next Steps" subtitle="What this UI shell enables">
          <ul className="list">
            <li>Customer: browse products, cart, checkout, order tracking</li>
            <li>Vendor: store setup, product CRUD, order management, analytics</li>
            <li>Admin: user/vendor management, approvals, platform analytics</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}


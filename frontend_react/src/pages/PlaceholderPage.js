import React from "react";
import { Card } from "../components/ui/Card";

// PUBLIC_INTERFACE
export function PlaceholderPage({ title, description, children }) {
  /** Simple placeholder page used until real feature screens are implemented. */
  return (
    <div className="page">
      <Card title={title} subtitle={description}>
        {children || <p className="muted">This section is wired in the UI and ready for API integration.</p>}
      </Card>
    </div>
  );
}


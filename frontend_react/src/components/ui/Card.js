import React from "react";

// PUBLIC_INTERFACE
export function Card({ title, subtitle, actions, children, className = "" }) {
  /** Retro themed card container for sections and content blocks. */
  return (
    <section className={["card", className].filter(Boolean).join(" ")}>
      {(title || subtitle || actions) && (
        <header className="card-header">
          <div className="card-header-text">
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}


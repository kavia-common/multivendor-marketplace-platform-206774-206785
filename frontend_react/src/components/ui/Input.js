import React from "react";

// PUBLIC_INTERFACE
export function Input({ label, hint, error, className = "", ...props }) {
  /** Accessible labeled input with hint/error display. */
  const id = props.id || props.name;

  return (
    <label className={["field", className].filter(Boolean).join(" ")}>
      {label && (
        <span className="field-label">
          {label}
          {props.required ? <span className="field-required"> *</span> : null}
        </span>
      )}
      <input
        id={id}
        className={["input", error ? "input-error" : ""].filter(Boolean).join(" ")}
        {...props}
      />
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}


import React, { useMemo, useState } from "react";
import { useAuth } from "../../state/AuthContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// PUBLIC_INTERFACE
export function AuthModal({ isOpen, mode, onClose, onModeChange }) {
  /**
   * Modal for login/register flows.
   *
   * Props:
   * - isOpen: boolean
   * - mode: "login" | "register"
   * - onClose: function
   * - onModeChange: function(nextMode)
   */
  const { login, register, authStatus } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState(null);

  const title = mode === "register" ? "Create Account" : "Welcome Back";
  const subtitle =
    mode === "register"
      ? "Register to access customer, vendor, or admin tools."
      : "Login to continue with your marketplace session.";

  const actions = useMemo(() => {
    return (
      <>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </>
    );
  }, [onClose]);

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const next = {};
    if (mode === "register" && !String(form.name || "").trim()) next.name = "Name is required";
    if (!String(form.email || "").trim()) next.email = "Email is required";
    else if (!isValidEmail(form.email)) next.email = "Enter a valid email";
    if (!String(form.password || "")) next.password = "Password is required";
    else if (String(form.password).length < 6) next.password = "Use at least 6 characters";
    if (mode === "register" && !String(form.role || "")) next.role = "Role is required";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    try {
      if (mode === "register") {
        const payload = await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });

        // If backend doesn't auto-login, try login after register.
        const gotToken = Boolean(payload?.token || payload?.accessToken || payload?.jwt);
        if (!gotToken) {
          await login({ email: form.email.trim(), password: form.password });
        }
      } else {
        await login({ email: form.email.trim(), password: form.password });
      }

      onClose();
    } catch (err) {
      setMessage(String(err?.bodyText || err?.message || err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <Card
          title={title}
          subtitle={subtitle}
          actions={actions}
          className="modal-card"
        >
          <form className="form" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <>
                <Input
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setValue("name", e.target.value)}
                  placeholder="Jane Vendor"
                  required
                  error={fieldErrors.name}
                />

                <label className="field">
                  <span className="field-label">
                    Role <span className="field-required"> *</span>
                  </span>
                  <select
                    className="select"
                    value={form.role}
                    onChange={(e) => setValue("role", e.target.value)}
                    aria-label="Select account role"
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {fieldErrors.role ? <span className="field-error">{fieldErrors.role}</span> : null}
                  <span className="field-hint">Role controls which dashboard modules are visible.</span>
                </label>
              </>
            ) : null}

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setValue("email", e.target.value)}
              placeholder="you@example.com"
              required
              error={fieldErrors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setValue("password", e.target.value)}
              placeholder="••••••••"
              required
              error={fieldErrors.password}
              hint="Your credentials are sent to /api/v1/auth/* on the backend."
            />

            {message ? (
              <div className="callout callout-error" role="alert">
                <div className="callout-title">Authentication error</div>
                <div className="callout-body">{message}</div>
              </div>
            ) : null}

            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={authStatus.state === "loading"}>
                {authStatus.state === "loading"
                  ? "Working…"
                  : mode === "register"
                    ? "Create account"
                    : "Login"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => onModeChange(mode === "register" ? "login" : "register")}
              >
                {mode === "register" ? "I already have an account" : "Create an account"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

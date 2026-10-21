import { useState } from "react";
import { ApiError } from "../content/api";

export default function AdminLogin({ onSignIn }: { onSignIn: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSignIn(email, password);
    } catch (err) {
      if (err instanceof ApiError && err.code === "too_many_login_attempts") {
        setError("Too many attempts. Please wait ten minutes and try again.");
      } else if (err instanceof ApiError && err.code === "invalid_credentials") {
        setError("That email and password combination was not recognised.");
      } else {
        setError("Could not sign in. Please check your connection and try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>Content manager</h1>
        <p className="admin-muted">Sign in to manage the hospital’s images and page content.</p>
        <label className="field">
          <span className="field-label">Email</span>
          <input className="field-input" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input className="field-input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-button admin-button-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

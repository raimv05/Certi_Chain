import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useWallet } from "../hooks/useWallet";
import { Lock, LogIn, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { walletAddress, chainId, isCorrectNetwork, expectedNetworkName, connectWallet } = useWallet();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const registered = searchParams.get("registered");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.data);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card animate-slide-up">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ color: "var(--primary)", display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <h1>Admin Login</h1>
          <p style={{ marginTop: "0.5rem" }}>
            Access your certificate management dashboard
          </p>
        </div>

        {registered && (
          <div style={{
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(0, 255, 157, 0.1)",
            color: "var(--success)",
            marginBottom: "1.5rem",
            border: "1px solid rgba(0, 255, 157, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <CheckCircle size={18} /> Account created successfully! Please log in.
          </div>
        )}

        {error && (
          <div style={{
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(255, 51, 102, 0.1)",
            color: "var(--danger)",
            marginBottom: "1.5rem",
            border: "1px solid rgba(255, 51, 102, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: "2rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Admin Email *
            </label>
            <input
              type="email"
              placeholder="admin@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Password *
            </label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={submitting} style={{ marginTop: "0.5rem" }}>
            <LogIn size={18} /> {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="panel" style={{ padding: "1.5rem", marginBottom: "1.5rem", background: "rgba(0,0,0,0.3)" }}>
          <p style={{ fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg> 
            MetaMask Connection
          </p>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            {chainId ? (
              <>
                Current network: <strong>{chainId}</strong>
                {isCorrectNetwork ? (
                  <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <CheckCircle size={14} /> Correct network
                  </span>
                ) : (
                  <span style={{ color: "var(--warning)", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <AlertTriangle size={14} /> Please switch to {expectedNetworkName}
                  </span>
                )}
              </>
            ) : (
              <span>No wallet connected</span>
            )}
          </div>
          <button
            className="secondary"
            onClick={connectWallet}
            style={{ width: "100%", padding: "0.75rem", fontSize: "0.95rem" }}
          >
            {walletAddress ? (
              <><CheckCircle size={16} /> Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</>
            ) : (
              <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg> Connect MetaMask</>
            )}
          </button>
        </div>

        <p style={{ textAlign: "center", marginBottom: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>

        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </p>
      </div>
    </main>
  );
}

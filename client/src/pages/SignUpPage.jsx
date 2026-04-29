import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useWallet } from "../hooks/useWallet";
import { UserPlus, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { walletAddress, chainId, isCorrectNetwork, expectedNetworkName, connectWallet } = useWallet();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!walletAddress) {
      setError("You must connect your MetaMask wallet before signing up.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 10) {
      setError("Password must be at least 10 characters");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        name: form.name,
        role: "issuer",
        walletAddress: walletAddress
      });

      navigate("/login?registered=true");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card animate-slide-up">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ color: "var(--primary)", display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <UserPlus size={48} strokeWidth={1.5} />
          </div>
          <h1>Create Your CertiChain Account</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.75rem" }}>
            Join institutions worldwide managing certificates securely
          </p>
        </div>

        {error && (
          <div className="animate-slide-up" style={{
            padding: "1rem 1.5rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(255, 51, 102, 0.1)",
            color: "var(--danger)",
            marginBottom: "1.5rem",
            border: "1px solid rgba(255, 51, 102, 0.2)",
            fontSize: "0.95rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <AlertTriangle size={20} /> {error}
            </div>
            {error.includes("MetaMask wallet is already linked") && (
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  color: "var(--primary)", 
                  textDecoration: "underline", 
                  marginLeft: "2rem",
                  fontSize: "0.85rem",
                  fontWeight: "500"
                }}
              >
                Create a new MetaMask wallet
              </a>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Organization Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Your University Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Admin Email *
            </label>
            <input
              type="email"
              placeholder="admin@organization.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Password *
            </label>
            <input
              type="password"
              placeholder="At least 10 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Confirm Password *
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <div className="panel" style={{ padding: "1.25rem", marginTop: "0.5rem", background: "rgba(0,0,0,0.3)" }}>
            <p style={{ fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg> 
              MetaMask Connection (Required)
            </p>
            {!window.ethereum ? (
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                MetaMask is required to sign up. 
                <a href="https://metamask.io/download/" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", marginLeft: "0.5rem", fontWeight: "500", textDecoration: "none" }}>
                  Download MetaMask
                </a>
              </div>
            ) : (
              <>
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
                  type="button"
                  className="secondary"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await connectWallet();
                      setError(null);
                    } catch (err) {
                      setError(err.message || "Failed to connect wallet");
                    }
                  }}
                  style={{ width: "100%", padding: "0.75rem", fontSize: "0.95rem" }}
                >
                  {walletAddress ? (
                    <><CheckCircle size={16} color="var(--success)" /> Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</>
                  ) : (
                    <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg> Connect MetaMask</>
                  )}
                </button>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !walletAddress}
            style={{
              marginTop: "1rem",
              padding: "1rem",
              fontSize: "1rem"
            }}
          >
            <UserPlus size={18} /> {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>
            Sign in
          </Link>
        </p>

        <p style={{ textAlign: "center", fontSize: "0.9rem", marginTop: "1rem" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

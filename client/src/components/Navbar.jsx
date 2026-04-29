import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShieldCheck, LayoutDashboard, LogOut, LogIn, Menu, X, UserPlus } from "lucide-react";

export default function Navbar() {
  const { token, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? "var(--primary)" : "var(--text-secondary)";

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem var(--gap-lg)",
      borderBottom: "1px solid var(--line)",
      background: "rgba(10, 11, 16, 0.8)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      position: "sticky",
      top: "0",
      zIndex: "100"
    }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem", transition: "var(--transition-fast)" }} onMouseOver={e=>e.currentTarget.style.opacity="0.8"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>
        <div style={{ color: "var(--primary)", display: "flex" }}><ShieldCheck size={28} /></div>
        <div style={{ fontWeight: "700", fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
          CertiChain
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: "flex", alignItems: "center", gap: "var(--gap-lg)" }}>
        <Link to="/" style={{ textDecoration: "none", color: isActive("/"), fontWeight: "500", transition: "var(--transition)" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color=isActive("/")}>
          Home
        </Link>
        <Link to="/about" style={{ textDecoration: "none", color: isActive("/about"), fontWeight: "500", transition: "var(--transition)" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color=isActive("/about")}>
          About
        </Link>
        <Link to="/verify" style={{ textDecoration: "none", color: isActive("/verify"), fontWeight: "500", transition: "var(--transition)" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color=isActive("/verify")}>
          Verify
        </Link>
        <Link to="/contact" style={{ textDecoration: "none", color: isActive("/contact"), fontWeight: "500", transition: "var(--transition)" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color=isActive("/contact")}>
          Contact
        </Link>

        {token ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <button className="secondary" style={{ padding: "0.65rem 1rem", fontSize: "0.9rem" }}>
                <LayoutDashboard size={16} /> Dashboard
              </button>
            </Link>
            <button onClick={logout} style={{ padding: "0.65rem 1rem", fontSize: "0.9rem" }} className="secondary">
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="secondary" style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem" }}>
                Login
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem" }}>
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="mobile-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          background: "transparent",
          border: "none",
          color: "var(--text-primary)",
          cursor: "pointer",
          padding: "0.5rem",
          boxShadow: "none"
        }}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: "0",
          right: "0",
          background: "var(--bg-dark)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--gap-md)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          animation: "slideDown 0.3s ease"
        }}>
          <Link to="/" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: "500", padding: "0.5rem 0" }}>
            Home
          </Link>
          <Link to="/about" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: "500", padding: "0.5rem 0" }}>
            About
          </Link>
          <Link to="/verify" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: "500", padding: "0.5rem 0" }}>
            Verify
          </Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: "500", padding: "0.5rem 0" }}>
            Contact
          </Link>
          <div style={{ borderTop: "1px solid var(--line)", margin: "0.5rem 0" }}></div>
          {token ? (
            <>
              <Link to="/admin" style={{ textDecoration: "none" }}>
                <button className="secondary" style={{ width: "100%", padding: "0.85rem" }}>
                  <LayoutDashboard size={18} /> Dashboard
                </button>
              </Link>
              <button onClick={logout} className="secondary" style={{ width: "100%", padding: "0.85rem" }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button className="secondary" style={{ width: "100%", padding: "0.85rem" }}>
                  <LogIn size={18} /> Login
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button style={{ width: "100%", padding: "0.85rem" }}>
                  <UserPlus size={18} /> Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

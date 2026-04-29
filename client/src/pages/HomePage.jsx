import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Globe, Shield, Briefcase, BarChart3, Users, QrCode, Layers, ArrowRight, CheckCircle, GraduationCap, ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero" style={{
        padding: "6rem var(--gap-lg) 4rem",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ maxWidth: "900px", textAlign: "center" }} className="animate-slide-down">
          <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={16} /> Blockchain-Based Certificate Management
          </p>
          <h1>
            Secure, Verifiable Digital Credentials
          </h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto 2.5rem" }}>
            CertiChain eliminates certificate fraud with blockchain technology. Instantly verify academic and professional credentials worldwide without intermediaries.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <Link to="/verify" style={{ textDecoration: "none" }}>
              <button style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
                <CheckCircle size={20} /> Verify Certificate
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button className="secondary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
                <ClipboardList size={20} /> Get Started
              </button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="stats-grid animate-slide-up stagger-1">
            <div className="stat-card">
              <div style={{ color: "var(--primary)", marginBottom: "1rem" }}><ShieldCheck size={40} /></div>
              <div style={{ fontWeight: "700", fontSize: "1.25rem", color: "var(--text-primary)" }}>Immutable</div>
              <p style={{ fontSize: "0.95rem" }}>Blockchain-secured records</p>
            </div>
            <div className="stat-card">
              <div style={{ color: "var(--secondary-light)", marginBottom: "1rem" }}><Zap size={40} /></div>
              <div style={{ fontWeight: "700", fontSize: "1.25rem", color: "var(--text-primary)" }}>Instant Verification</div>
              <p style={{ fontSize: "0.95rem" }}>Real-time credential checks</p>
            </div>
            <div className="stat-card">
              <div style={{ color: "var(--success)", marginBottom: "1rem" }}><Globe size={40} /></div>
              <div style={{ fontWeight: "700", fontSize: "1.25rem", color: "var(--text-primary)" }}>Global Access</div>
              <p style={{ fontSize: "0.95rem" }}>Verify from anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "5rem var(--gap-lg)", background: "rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="eyebrow">Features</p>
            <h2 style={{ marginTop: "1rem" }}>Why Choose CertiChain?</h2>
          </div>

          <div className="content-grid">
            {[
              {
                icon: <Shield size={32} />,
                title: "Fraud Prevention",
                description: "Blockchain makes it mathematically impossible to forge or modify certificates",
                color: "var(--primary)"
              },
              {
                icon: <Briefcase size={32} />,
                title: "Enterprise Ready",
                description: "Scalable solution for universities, companies, and certification bodies",
                color: "var(--secondary-light)"
              },
              {
                icon: <BarChart3 size={32} />,
                title: "Complete Analytics",
                description: "Track issuance, revocation, and verification metrics in real-time",
                color: "var(--success)"
              },
              {
                icon: <Users size={32} />,
                title: "Role-Based Access",
                description: "Admin controls with JWT authentication and blockchain authorization",
                color: "var(--warning)"
              },
              {
                icon: <QrCode size={32} />,
                title: "QR Code Support",
                description: "Easy mobile sharing and instant verification via QR scanning",
                color: "var(--danger)"
              },
              {
                icon: <Layers size={32} />,
                title: "Bulk Operations",
                description: "Issue hundreds of certificates at once with CSV import",
                color: "var(--primary-dark)"
              }
            ].map((feature, idx) => (
              <div key={idx} className="panel">
                <div style={{ color: feature.color, marginBottom: "1.5rem" }}>{feature.icon}</div>
                <h3 style={{ marginBottom: "0.75rem", fontSize: "1.3rem" }}>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "5rem var(--gap-lg)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="eyebrow">Process</p>
            <h2 style={{ marginTop: "1rem" }}>How It Works</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem"
          }}>
            {[
              {
                step: "1",
                title: "Issue Certificate",
                description: "Admin uploads certificate with recipient details"
              },
              {
                step: "2",
                title: "Anchor on Blockchain",
                description: "File hash stored immutably on Ethereum Sepolia"
              },
              {
                step: "3",
                title: "Store on IPFS",
                description: "Certificate file saved on decentralized storage"
              },
              {
                step: "4",
                title: "Instant Verification",
                description: "Anyone can verify anytime, anywhere globally"
              }
            ].map((item, idx) => (
              <div key={idx} style={{ position: "relative", textAlign: "center" }} className="panel">
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  margin: "0 auto 1.5rem",
                  boxShadow: "var(--shadow-glow)"
                }}>
                  {item.step}
                </div>
                <h3 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.9rem" }}>{item.description}</p>
                {idx < 3 && (
                  <div style={{
                    position: "absolute",
                    top: "35px",
                    right: "-20px",
                    color: "var(--primary)",
                    display: "none"
                  }} className="arrow-icon">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "5rem var(--gap-lg)",
        background: "linear-gradient(135deg, var(--primary-dark), var(--secondary))",
        textAlign: "center",
        borderTop: "1px solid var(--line-light)"
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ color: "white", marginBottom: "1.5rem", fontSize: "2.5rem" }}>Ready to Transform Credential Management?</h2>
          <p style={{ fontSize: "1.15rem", marginBottom: "2.5rem", color: "rgba(255,255,255,0.9)" }}>
            Join institutions worldwide using CertiChain for secure, verifiable digital certificates
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "1rem 2.5rem",
                background: "white",
                color: "var(--bg-dark)",
                textShadow: "none"
              }}>
                Sign Up Now
              </button>
            </Link>
            <Link to="/contact" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "1rem 2.5rem",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(10px)",
                boxShadow: "none",
                textShadow: "none"
              }}>
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "3rem var(--gap-lg)",
        borderTop: "1px solid var(--line)",
        background: "var(--bg-dark)",
        textAlign: "center"
      }}>
        <p>© 2026 CertiChain. Blockchain-based certificate verification. All rights reserved.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1.5rem", fontSize: "0.95rem" }}>
          <Link to="/about" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color="var(--text-secondary)"}>About</Link>
          <Link to="/contact" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color="var(--text-secondary)"}>Contact</Link>
          <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color="var(--text-secondary)"}>Privacy Policy</a>
          <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e=>e.target.style.color="var(--primary)"} onMouseOut={e=>e.target.style.color="var(--text-secondary)"}>Terms of Service</a>
        </div>
      </footer>
      <style>{`
        @media (min-width: 768px) {
          .arrow-icon { display: block !important; }
        }
      `}</style>
    </main>
  );
}

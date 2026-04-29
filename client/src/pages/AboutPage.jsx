export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section style={{
        padding: "3rem var(--gap-lg)",
        background: "linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(37, 99, 235, 0.08))",
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p className="eyebrow">About Us</p>
          <h1 style={{ marginTop: "1rem" }}>Revolutionizing Certificate Verification</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "1rem", lineHeight: "1.8" }}>
            CertiChain is a next-generation platform built to eliminate certificate fraud and streamline credential verification using blockchain technology and decentralized storage.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: "4rem var(--gap-lg)", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <h2 style={{ marginBottom: "1rem" }}>Our Mission</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1rem" }}>
              To create a world where digital credentials are universally trusted, instantly verifiable, and impossible to counterfeit. We believe every achievement deserves permanent, tamper-proof recognition.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
              By leveraging blockchain technology and decentralized storage, CertiChain removes intermediaries from the verification process, making it faster, cheaper, and more reliable for institutions and certificate holders worldwide.
            </p>
          </div>
          <div style={{ fontSize: "4rem", textAlign: "center" }}>🎯</div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section style={{
        padding: "4rem var(--gap-lg)",
        background: "rgba(15, 23, 42, 0.02)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>The Problem We Solve</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem"
          }}>
            <div style={{
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              border: "2px solid var(--danger)",
              background: "rgba(185, 28, 28, 0.05)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❌</div>
              <h3 style={{ color: "var(--danger)" }}>Certificate Fraud</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Forged credentials cost employers and institutions billions annually
              </p>
            </div>
            <div style={{
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              border: "2px solid var(--warning)",
              background: "rgba(245, 158, 11, 0.05)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏱️</div>
              <h3 style={{ color: "var(--warning)" }}>Slow Verification</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Manual verification processes take weeks or require direct contact with institutions
              </p>
            </div>
            <div style={{
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              border: "2px solid var(--secondary)",
              background: "rgba(37, 99, 235, 0.05)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💰</div>
              <h3 style={{ color: "var(--secondary)" }}>High Costs</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Verification services and intermediaries charge significant fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section style={{ padding: "4rem var(--gap-lg)", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Our Solution</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem"
        }}>
          {[
            {
              icon: "🔒",
              title: "Blockchain Security",
              description: "Certificates anchored on Ethereum Sepolia with immutable SHA-256 hashing"
            },
            {
              icon: "⚡",
              title: "Instant Verification",
              description: "Verify credentials in seconds instead of weeks"
            },
            {
              icon: "🌍",
              title: "Decentralized Storage",
              description: "Files stored on IPFS/Pinata, not controlled by any single entity"
            },
            {
              icon: "🎯",
              title: "Fraud Prevention",
              description: "Cryptographic verification makes forgery mathematically impossible"
            },
            {
              icon: "💼",
              title: "Enterprise Ready",
              description: "JWT authentication, role-based access, and comprehensive audit trails"
            },
            {
              icon: "📱",
              title: "Mobile Friendly",
              description: "QR codes, responsive design, and public verification portal"
            }
          ].map((solution, idx) => (
            <div key={idx} style={{
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
              background: "var(--surface)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{solution.icon}</div>
              <h3 style={{ marginBottom: "0.75rem" }}>{solution.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section style={{
        padding: "4rem var(--gap-lg)",
        background: "rgba(15, 23, 42, 0.02)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Built With Modern Technology</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem"
          }}>
            {[
              { name: "React", icon: "⚛️" },
              { name: "Node.js + Express", icon: "🟢" },
              { name: "Solidity Smart Contracts", icon: "📝" },
              { name: "Ethereum Sepolia", icon: "⛓️" },
              { name: "MongoDB", icon: "🍃" },
              { name: "IPFS/Pinata", icon: "📦" },
              { name: "JWT Authentication", icon: "🔐" },
              { name: "MetaMask", icon: "🦊" }
            ].map((tech, idx) => (
              <div key={idx} style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--line)",
                background: "white",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{tech.icon}</div>
                <div style={{ fontWeight: "600" }}>{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: "4rem var(--gap-lg)", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Our Team</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "3rem", lineHeight: "1.8" }}>
          CertiChain is built by a team of blockchain developers, security experts, and education technologists passionate about eliminating fraud and making credentials universally verifiable.
        </p>
      </section>

      {/* Impact Section */}
      <section style={{
        padding: "4rem var(--gap-lg)",
        background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
        color: "white",
        borderTop: "1px solid var(--line)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "white", marginBottom: "2rem" }}>The Impact</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem"
          }}>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>∞</div>
              <p>Credentials Never Expire</p>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>0%</div>
              <p>Forgery Rate</p>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>2s</div>
              <p>Verification Time</p>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>24/7</div>
              <p>Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "2rem var(--gap-lg)",
        borderTop: "1px solid var(--line)",
        background: "rgba(15, 23, 42, 0.02)",
        textAlign: "center",
        color: "var(--text-muted)"
      }}>
        <p>© 2026 CertiChain. Blockchain-based certificate verification. All rights reserved.</p>
      </footer>
    </main>
  );
}

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSuccess(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 4000);
    setSubmitting(false);
  }

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        padding: "3rem var(--gap-lg)",
        background: "linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(37, 99, 235, 0.08))",
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p className="eyebrow">Get In Touch</p>
          <h1 style={{ marginTop: "1rem" }}>Contact Us</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "1rem", lineHeight: "1.8" }}>
            Have questions about CertiChain? Want to discuss a partnership? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: "4rem var(--gap-lg)", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem"
        }}>
          {/* Contact Form */}
          <form onSubmit={handleSubmit} style={{
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--line)",
            background: "var(--surface)"
          }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Send us a Message</h2>

            {success && (
              <div style={{
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(34, 197, 94, 0.1)",
                color: "var(--success)",
                marginBottom: "1rem",
                border: "1px solid rgba(34, 197, 94, 0.2)"
              }}>
                ✓ Thank you! We'll be in touch soon.
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                Name *
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                Email *
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                Subject *
              </label>
              <input
                type="text"
                placeholder="What is this about?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                Message *
              </label>
              <textarea
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
              />
            </div>

            <button type="submit" disabled={submitting} style={{ width: "100%", padding: "1rem" }}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Contact Information */}
          <div>
            <h2 style={{ marginBottom: "2rem" }}>Other Ways to Reach Us</h2>

            <div style={{
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
              background: "var(--surface)",
              marginBottom: "1.5rem"
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>📧</div>
              <h3 style={{ marginBottom: "0.5rem" }}>Email</h3>
              <a href="mailto:support@certichain.io" style={{
                color: "var(--secondary)",
                textDecoration: "none",
                fontSize: "1.05rem"
              }}>
                support@certichain.io
              </a>
              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Response within 24 hours
              </p>
            </div>

            <div style={{
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
              background: "var(--surface)",
              marginBottom: "1.5rem"
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🏢</div>
              <h3 style={{ marginBottom: "0.5rem" }}>Office</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Tech Innovation Hub<br />
                San Francisco, CA<br />
                United States
              </p>
            </div>

            <div style={{
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
              background: "var(--surface)"
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🤝</div>
              <h3 style={{ marginBottom: "0.5rem" }}>Follow Us</h3>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <a href="#" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  fontWeight: "700"
                }}>
                  𝕏
                </a>
                <a href="#" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none"
                }}>
                  f
                </a>
                <a href="#" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none"
                }}>
                  in
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{
        padding: "4rem var(--gap-lg)",
        background: "rgba(15, 23, 42, 0.02)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>Frequently Asked Questions</h2>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {[
              {
                q: "How much does CertiChain cost?",
                a: "We offer flexible pricing based on your institution's needs. Contact our sales team for a customized quote."
              },
              {
                q: "Can I integrate CertiChain with my existing systems?",
                a: "Yes! CertiChain provides comprehensive REST APIs for seamless integration with your existing infrastructure."
              },
              {
                q: "What blockchain does CertiChain use?",
                a: "We currently use Ethereum Sepolia for development and testing. Production deployments use Ethereum Mainnet."
              },
              {
                q: "How long does certificate verification take?",
                a: "Instant! Verification happens in under 2 seconds. Recipients can verify their credentials anytime, anywhere."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use industry-standard encryption, JWT authentication, and role-based access control. All hashes are stored on an immutable blockchain."
              },
              {
                q: "Can certificates be revoked?",
                a: "Yes. Issuers can revoke certificates at any time. The revocation is immediately recorded on the blockchain."
              }
            ].map((faq, idx) => (
              <div key={idx} style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--line)",
                background: "white"
              }}>
                <h3 style={{ marginBottom: "0.75rem", color: "var(--primary)" }}>❓ {faq.q}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{faq.a}</p>
              </div>
            ))}
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

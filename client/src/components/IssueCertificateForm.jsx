import { useState } from "react";
import api from "../services/api";

const initialState = {
  candidateName: "",
  courseName: "",
  issuerName: "",
  issueDate: "",
  notes: "",
};

export default function IssueCertificateForm({ onIssued, setGlobalProcessing }) {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    setGlobalProcessing("Anchoring certificate to Sepolia Blockchain... This may take a moment.");

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append("file", file);

      await api.post("/certificates", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm(initialState);
      setFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      onIssued();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue certificate");
    } finally {
      setSubmitting(false);
      setGlobalProcessing(null);
    }
  }

  const isComplete = form.candidateName && form.courseName && form.issuerName && form.issueDate && file;

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div>
        <h3>📜 Issue Certificate</h3>
        <p className="muted" style={{ marginTop: "0.5rem" }}>Create and anchor a new certificate on the blockchain</p>
      </div>

      {error && (
        <div style={{
          padding: "0.875rem 1rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(185, 28, 28, 0.1)",
          color: "var(--danger)",
          fontSize: "0.95rem",
          border: "1px solid rgba(185, 28, 28, 0.2)"
        }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: "0.875rem 1rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(34, 197, 94, 0.1)",
          color: "var(--success)",
          fontSize: "0.95rem",
          border: "1px solid rgba(34, 197, 94, 0.2)"
        }}>
          ✓ Certificate issued successfully!
        </div>
      )}

      <div>
        <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Candidate Name *
        </label>
        <input
          placeholder="e.g., John Doe"
          value={form.candidateName}
          onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
          required
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Course/Program Name *
        </label>
        <input
          placeholder="e.g., Full Stack Web Development"
          value={form.courseName}
          onChange={(e) => setForm({ ...form, courseName: e.target.value })}
          required
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Issuer Name *
        </label>
        <input
          placeholder="e.g., Academy Name"
          value={form.issuerName}
          onChange={(e) => setForm({ ...form, issuerName: e.target.value })}
          required
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Issue Date *
        </label>
        <input
          type="date"
          value={form.issueDate}
          onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
          required
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Certificate File *
        </label>
        <div style={{
          position: "relative",
          border: "2px dashed var(--primary)",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          textAlign: "center",
          cursor: "pointer",
          background: file ? "rgba(15, 118, 110, 0.05)" : "transparent",
          transition: "var(--transition)"
        }}>
          <input
            type="file"
            accept=".pdf,.json,application/pdf,application/json"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{
              position: "absolute",
              inset: "0",
              opacity: "0",
              cursor: "pointer",
              width: "100%",
              height: "100%"
            }}
          />
          {file ? (
            <div>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📄</div>
              <div style={{ fontWeight: "600", color: "var(--primary)" }}>{file.name}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                {(file.size / 1024).toFixed(2)} KB
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📥</div>
              <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>Upload Certificate Template</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Drag & drop or click to select
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Optional Notes
        </label>
        <textarea
          placeholder="Add any additional notes..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !isComplete}
        style={{
          opacity: isComplete ? 1 : 0.6,
          cursor: isComplete && !submitting ? "pointer" : "not-allowed"
        }}
      >
        {submitting ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
            Issuing on Sepolia...
          </>
        ) : (
          <>✓ Issue Certificate</>
        )}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}

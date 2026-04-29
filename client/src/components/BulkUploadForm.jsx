import { useState } from "react";
import api from "../services/api";

export default function BulkUploadForm({ onUploaded, setGlobalProcessing }) {
  const [csvFile, setCsvFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!csvFile || !templateFile) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setGlobalProcessing("Processing bulk issuance and generating customized PDFs... Please wait.");

    try {
      const payload = new FormData();
      payload.append("csv", csvFile);
      payload.append("template", templateFile);
      const response = await api.post("/certificates/bulk", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.data.reportCsv) {
        const blob = new Blob([response.data.reportCsv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bulk_issuance_report_${Date.now()}.csv`;
        a.click();
      }

      setCsvFile(null);
      setTemplateFile(null);
      setSuccess(`Successfully processed ${response.data.data?.length || "certificates"}! Your report is downloading.`);
      setTimeout(() => setSuccess(null), 5000);
      onUploaded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process bulk issuance");
    } finally {
      setSubmitting(false);
      setGlobalProcessing(null);
    }
  }

  const downloadTemplate = () => {
    const csv = "candidateName,courseName,issuerName,issueDate\nJohn Doe,Full Stack Development,Academy Name,2026-04-22";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificates_template.csv";
    a.click();
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div>
        <h3>📊 Bulk Issue via CSV</h3>
        <p className="muted" style={{ marginTop: "0.5rem" }}>Issue multiple certificates at once</p>
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
          ✓ {success}
        </div>
      )}

      <div style={{ padding: "0.875rem", background: "rgba(37, 99, 235, 0.08)", borderRadius: "var(--radius-md)", fontSize: "0.9rem" }}>
        <p style={{ margin: "0 0 0.5rem", fontWeight: "600", color: "var(--secondary)" }}>
          📋 CSV Format Required
        </p>
        <code style={{
          display: "block",
          background: "white",
          padding: "0.5rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8rem",
          overflow: "auto",
          color: "var(--text-secondary)",
          fontFamily: "monospace",
          marginBottom: "0.5rem"
        }}>
          candidateName,courseName,issuerName,issueDate
        </code>
        <button
          type="button"
          onClick={downloadTemplate}
          style={{
            padding: "0.35rem 0.75rem",
            fontSize: "0.85rem",
            background: "white",
            color: "var(--secondary)",
            border: "1px solid var(--secondary)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer"
          }}
        >
          📥 Download Template
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* CSV Upload Block */}
        <div>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            1. Data (CSV) *
          </label>
          <div style={{
            position: "relative",
            border: csvFile ? "2px solid var(--success)" : "2px dashed var(--primary)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: csvFile ? "rgba(34, 197, 94, 0.05)" : "transparent",
            transition: "var(--transition)"
          }}>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
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
            {csvFile ? (
              <div>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📄</div>
                <div style={{ fontWeight: "600", color: "var(--success)" }}>{csvFile.name}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  {(csvFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📥</div>
                <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>Upload Data</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  Select CSV file
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Upload Block */}
        <div>
          <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            2. Template (PDF) *
          </label>
          <div style={{
            position: "relative",
            border: templateFile ? "2px solid var(--success)" : "2px dashed var(--primary)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: templateFile ? "rgba(34, 197, 94, 0.05)" : "transparent",
            transition: "var(--transition)"
          }}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
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
            {templateFile ? (
              <div>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🖼️</div>
                <div style={{ fontWeight: "600", color: "var(--success)" }}>{templateFile.name}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  {(templateFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📥</div>
                <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>Upload Certificate Template</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  Select PDF template
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !csvFile || !templateFile}
        style={{
          opacity: csvFile && templateFile && !submitting ? 1 : 0.6,
          cursor: csvFile && templateFile && !submitting ? "pointer" : "not-allowed"
        }}
      >
        {submitting ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
            Processing CSV...
          </>
        ) : (
          <>✓ Process Bulk Upload</>
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

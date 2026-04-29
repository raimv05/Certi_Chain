import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QrScanner from "../components/QrScanner";
import VerificationCard from "../components/VerificationCard";
import api from "../services/api";
import { CheckCircle, Search, UploadCloud, FileJson, AlertTriangle, ShieldCheck } from "lucide-react";

export default function VerifyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(searchParams.get("certificateId") || "");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = searchParams.get("certificateId");
    if (id) {
      handleVerifyId(id);
    }
  }, []);

  async function handleVerifyId(value = certificateId) {
    if (!value.trim()) {
      setError("Please enter a certificate ID");
      return;
    }
    
    try {
      setVerifying(true);
      setError(null);
      const response = await api.get(`/certificates/verify/${value}`);
      setResult(response.data.data);
      setSearchParams({ certificateId: value });
    } catch (err) {
      setError(err.response?.data?.message || "Certificate not found");
      setResult(null);
    } finally {
      setVerifying(false);
    }
  }

  async function handleVerifyFile(event) {
    event.preventDefault();
    if (!file) return;

    try {
      setVerifying(true);
      setError(null);
      const payload = new FormData();
      payload.append("file", file);
      const response = await api.post("/certificates/verify/file", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Certificate verification failed");
      setResult(null);
    } finally {
      setVerifying(false);
    }
  }

  function handleScan(decodedText) {
    try {
      const url = new URL(decodedText);
      const id = url.searchParams.get("certificateId");
      if (id) {
        setCertificateId(id);
        handleVerifyId(id);
      }
    } catch {
      const id = decodedText.trim();
      setCertificateId(id);
      handleVerifyId(id);
    }
  }

  return (
    <main className="verify-shell">
      <section className="verify-hero animate-slide-down">
        <div>
          <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <CheckCircle size={16} /> Public Verification Portal
          </p>
          <h1>Verify Academic Credentials</h1>
          <p className="muted" style={{ marginTop: "1rem", maxWidth: "700px", margin: "1rem auto 0", fontSize: "1.1rem", lineHeight: "1.6" }}>
            Validate certificates instantly using multiple verification methods. Search by certificate ID, upload the original file for hash matching, or scan the QR code. All certificates are secured on the Ethereum Sepolia blockchain.
          </p>
        </div>
      </section>

      <section className="verify-grid animate-slide-up stagger-1" style={{ marginTop: "var(--gap-xl)" }}>
        <div className="panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={22} color="var(--primary)" /> Verify by ID
          </h3>
          <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>Enter the certificate ID to verify instantly</p>
          <div style={{ marginTop: "var(--gap-md)" }}>
            <input
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="e.g., 998fea9b-78cd-4f9f-a7a8-67446cb9d8c4"
              onKeyPress={(e) => e.key === "Enter" && handleVerifyId()}
              style={{ fontSize: "1rem", padding: "1rem" }}
            />
            <button
              onClick={() => handleVerifyId()}
              disabled={verifying || !certificateId.trim()}
              style={{ marginTop: "1rem", width: "100%", padding: "1rem" }}
            >
              <ShieldCheck size={18} /> {verifying ? "Verifying..." : "Verify Identity"}
            </button>
          </div>
        </div>

        <form className="panel" onSubmit={handleVerifyFile}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileJson size={22} color="var(--secondary-light)" /> Verify by File Hash
          </h3>
          <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>Upload certificate to verify SHA-256 hash</p>
          <div style={{ marginTop: "var(--gap-md)" }}>
            <div style={{
              position: "relative",
              border: file ? "2px solid var(--success)" : "2px dashed var(--line)",
              borderRadius: "var(--radius-md)",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              background: file ? "rgba(0, 255, 157, 0.05)" : "rgba(0,0,0,0.2)",
              transition: "var(--transition)"
            }} onMouseOver={e=>e.currentTarget.style.borderColor=file?"var(--success)":"var(--primary)"} onMouseOut={e=>e.currentTarget.style.borderColor=file?"var(--success)":"var(--line)"}>
              <input
                type="file"
                accept=".pdf,.json,application/pdf,application/json"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{
                  position: "absolute",
                  inset: "0",
                  opacity: "0",
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  zIndex: 2
                }}
              />
              {file ? (
                <div>
                  <div style={{ color: "var(--success)", display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}><CheckCircle size={32} /></div>
                  <div style={{ fontWeight: "600", color: "var(--success)", fontSize: "1.1rem" }}>{file.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ color: "var(--text-muted)", display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}><UploadCloud size={32} /></div>
                  <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "1.1rem" }}>Select certificate</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>PDF or JSON file</div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={verifying || !file}
              className="secondary"
              style={{ marginTop: "1rem", width: "100%", padding: "1rem" }}
            >
              <ShieldCheck size={18} /> {verifying ? "Verifying..." : "Compare Hash"}
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="animate-slide-up" style={{
          marginTop: "var(--gap-lg)",
          padding: "1rem 1.5rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(255, 51, 102, 0.1)",
          color: "var(--danger)",
          border: "1px solid rgba(255, 51, 102, 0.2)",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <AlertTriangle size={20} /> {error}
        </div>
      )}

      <div className="animate-slide-up stagger-2" style={{ marginTop: "var(--gap-lg)" }}>
        <QrScanner onScan={handleScan} />
      </div>
      
      {result && (
        <div className="animate-fade-in" style={{ marginTop: "var(--gap-lg)" }}>
          <VerificationCard result={result} />
        </div>
      )}
    </main>
  );
}

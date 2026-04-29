import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CertificateTable({ certificates, onRevoke, setGlobalProcessing }) {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkRevoking, setIsBulkRevoking] = useState(false);
  const [showRevoked, setShowRevoked] = useState(false);
  
  const truncateId = (id) => id.substring(0, 8) + "..." + id.substring(id.length - 8);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === certificates.filter(c => c.status !== 'revoked').length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(certificates.filter(c => c.status !== 'revoked').map(c => c.certificateId));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkRevoke = async () => {
    if (!window.confirm(`Are you sure you want to revoke ${selectedIds.length} certificates? This action cannot be undone.`)) {
      return;
    }
    
    setIsBulkRevoking(true);
    if (setGlobalProcessing) setGlobalProcessing(`Revoking ${selectedIds.length} certificates... Please wait.`);
    try {
      // We process them sequentially for now to maintain existing blockchain logic
      for (const id of selectedIds) {
        await onRevoke(id);
      }
      setSelectedIds([]);
      alert(`Successfully revoked ${selectedIds.length} certificates!`);
    } catch (err) {
      console.error("Bulk revocation failed:", err);
      alert("Some certificates failed to revoke. Please check your connection.");
    } finally {
      setIsBulkRevoking(false);
      if (setGlobalProcessing) setGlobalProcessing(null);
    }
  };

  const displayedCertificates = showRevoked 
    ? certificates.filter(c => c.status === 'revoked')
    : certificates.filter(c => c.status !== 'revoked');

  return (
    <div className="panel">
      <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h3>📋 Issued Certificates</h3>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {displayedCertificates.length} {showRevoked ? "revoked" : "active"} {displayedCertificates.length === 1 ? "record" : "records"}
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.03)", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--line-light)", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: showRevoked ? "var(--danger)" : "var(--text-muted)" }}>
            {showRevoked ? "Viewing Revoked" : "Show Revoked Only"}
          </span>
          <button 
            onClick={() => setShowRevoked(!showRevoked)}
            type="button"
            style={{
              width: "40px",
              height: "20px",
              borderRadius: "10px",
              background: showRevoked ? "var(--danger)" : "rgba(255,255,255,0.1)",
              border: "none",
              position: "relative",
              cursor: "pointer",
              padding: 0,
              transition: "0.3s"
            }}
          >
            <div style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "white",
              position: "absolute",
              top: "3px",
              left: showRevoked ? "23px" : "3px",
              transition: "0.3s"
            }} />
          </button>
        </div>
      </div>
        {selectedIds.length > 0 && (
          <div className="animate-slide-in" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1rem", 
            background: "rgba(255, 51, 102, 0.1)", 
            padding: "0.5rem 1rem", 
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255, 51, 102, 0.2)"
          }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--danger)" }}>
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleBulkRevoke}
              disabled={isBulkRevoking}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                background: "var(--danger)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer"
              }}
            >
              {isBulkRevoking ? "Revoking..." : "🔴 Bulk Revoke"}
            </button>
          </div>
        )}
      <div className="table-wrap" style={{ 
        marginTop: "var(--gap-md)", 
        maxHeight: "400px", 
        overflowY: "auto",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--line-light)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead className="sticky-thead">
            <tr>
              <th style={{ width: "40px", paddingLeft: "1.5rem" }}>
                <input 
                  type="checkbox" 
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                  checked={selectedIds.length > 0 && selectedIds.length === displayedCertificates.filter(c => c.status !== 'revoked').length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Certificate ID
              </th>
              <th style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Recipient
              </th>
              <th style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Course
              </th>
              <th style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Status
              </th>
              <th style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Records
              </th>
              <th style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedCertificates.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📭</div>
                  No {showRevoked ? "" : "active"} certificates found
                </td>
              </tr>
            ) : (
              displayedCertificates.map((certificate) => (
                <tr key={certificate.certificateId} style={{ 
                  borderBottomColor: "var(--line-light)",
                  background: selectedIds.includes(certificate.certificateId) ? "rgba(37, 99, 235, 0.03)" : "transparent"
                }}>
                  <td style={{ paddingLeft: "1.5rem" }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: certificate.status === 'revoked' ? "not-allowed" : "pointer", width: "16px", height: "16px" }}
                      disabled={certificate.status === 'revoked'}
                      checked={selectedIds.includes(certificate.certificateId)}
                      onChange={() => toggleSelect(certificate.certificateId)}
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="hash-row">
                      <code style={{
                        padding: "0.35rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(15, 118, 110, 0.08)",
                        color: "var(--primary)",
                        fontSize: "0.85rem",
                        fontFamily: "monospace"
                      }}>
                        {truncateId(certificate.certificateId)}
                      </code>
                      <button
                        onClick={() => handleCopy(certificate.certificateId)}
                        title="Copy Full ID"
                        className="copy-btn"
                        style={{
                          background: "none",
                          border: "none",
                          color: copiedId === certificate.certificateId ? "var(--success)" : "var(--text-muted)",
                          cursor: "pointer",
                          padding: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "color 0.2s"
                        }}
                      >
                        {copiedId === certificate.certificateId ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    {certificate.candidateName}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {certificate.courseName}
                  </td>
                  <td>
                    <span className={`status-chip ${certificate.status}`}>
                      {certificate.status === "revoked" ? "⛔ Revoked" : "✓ Valid"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <a
                        href={certificate.ipfsUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View File on IPFS"
                        style={{
                          color: "var(--secondary)",
                          textDecoration: "none",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          padding: "0.35rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(37, 99, 235, 0.08)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          transition: "var(--transition)"
                        }}
                        onMouseEnter={(e) => e.target.style.background = "rgba(37, 99, 235, 0.15)"}
                        onMouseLeave={(e) => e.target.style.background = "rgba(37, 99, 235, 0.08)"}
                      >
                        🔗 IPFS
                      </a>
                      
                      {certificate.blockchainTxHash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${certificate.blockchainTxHash}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View Transaction on Etherscan"
                          style={{
                            color: "var(--primary)",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "var(--radius-sm)",
                            background: "rgba(0, 240, 255, 0.08)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            transition: "var(--transition)"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "rgba(0, 240, 255, 0.15)"}
                          onMouseLeave={(e) => e.target.style.background = "rgba(0, 240, 255, 0.08)"}
                        >
                          🌐 Tx
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      disabled={certificate.status === "revoked"}
                      onClick={() => {
                        if (window.confirm(`Revoke certificate for ${certificate.candidateName}? This action cannot be undone.`)) {
                          onRevoke(certificate.certificateId);
                        }
                      }}
                      style={{
                        padding: "0.5rem 0.875rem",
                        fontSize: "0.9rem",
                        opacity: certificate.status === "revoked" ? 0.5 : 1,
                        cursor: certificate.status === "revoked" ? "not-allowed" : "pointer",
                        background: certificate.status === "revoked" 
                          ? "rgba(185, 28, 28, 0.2)" 
                          : "linear-gradient(135deg, #dc2626, #b91c1c)"
                      }}
                    >
                      🔴 Revoke
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .hash-row .copy-btn { opacity: 0; transition: opacity 0.2s; }
        .hash-row:hover .copy-btn { opacity: 1; }
        .copy-btn:hover { color: var(--text-primary) !important; }
        .sticky-thead th {
          position: sticky;
          top: 0;
          background-color: var(--bg-panel, #0f172a);
          z-index: 10;
          box-shadow: 0 1px 0 var(--line-light);
        }
        /* Ensure table rows don't show through transparent gaps */
        .table-wrap table { border-spacing: 0; }
        .sticky-thead th::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: 1px solid var(--line-light);
        }
      `}</style>
    </div>
  );
}

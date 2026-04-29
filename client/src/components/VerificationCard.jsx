export default function VerificationCard({ result }) {
  if (!result) return null;

  const isValid = result.status === "valid" && result.blockchainValid;
  const statusColor = isValid ? "#16a34a" : "#b91c1c";
  const statusText = isValid ? "✓ Verified" : "⚠ Revoked";

  return (
    <div className="panel verification-card" style={{ marginTop: "var(--gap-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--gap-md)", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <p className="eyebrow">🎓 Certificate Verified</p>
          <h2 style={{ color: statusColor, marginTop: "0.5rem" }}>{result.candidateName}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "0.5rem" }}>
            {result.courseName}
          </p>
        </div>
        <div style={{
          padding: "1rem",
          borderRadius: "var(--radius-lg)",
          background: `${statusColor}15`,
          border: `2px solid ${statusColor}`,
          textAlign: "center",
          minWidth: "120px"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {isValid ? "✓" : "⚠"}
          </div>
          <div style={{
            fontWeight: "700",
            color: statusColor,
            fontSize: "1.1rem"
          }}>
            {statusText}
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "var(--gap-md)",
        marginBottom: "var(--gap-md)",
        padding: "var(--gap-md)",
        background: "rgba(15, 23, 42, 0.02)",
        borderRadius: "var(--radius-lg)"
      }}>
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.35rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Certificate ID
          </p>
          <code style={{
            background: "white",
            padding: "0.5rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.85rem",
            wordBreak: "break-all",
            display: "block",
            color: "var(--primary)",
            fontFamily: "monospace"
          }}>
            {result.certificateId}
          </code>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.35rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Issuer
          </p>
          <strong style={{ display: "block", fontSize: "1rem", marginTop: "0.25rem" }}>
            {result.issuerName}
          </strong>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.35rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Issue Date
          </p>
          <strong style={{ display: "block", fontSize: "1rem", marginTop: "0.25rem" }}>
            {new Date(result.issueDate).toLocaleDateString("en-US", { 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </strong>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.35rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Blockchain Status
          </p>
          <strong style={{
            display: "block",
            fontSize: "1rem",
            marginTop: "0.25rem",
            color: result.blockchainValid ? "var(--success)" : "var(--danger)"
          }}>
            {result.blockchainValid ? "✓ Confirmed" : "⚠ Revoked"}
          </strong>
        </div>
      </div>

      {result.documentHash && (
        <div style={{
          padding: "0.875rem",
          background: "rgba(15, 23, 42, 0.02)",
          borderRadius: "var(--radius-md)",
          marginBottom: "var(--gap-md)",
          fontSize: "0.85rem"
        }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.35rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            SHA-256 Hash
          </p>
          <code style={{
            display: "block",
            wordBreak: "break-all",
            color: "var(--text-secondary)",
            fontFamily: "monospace",
            lineHeight: "1.4"
          }}>
            {result.documentHash}
          </code>
        </div>
      )}

      {result.qrCodeDataUrl && (
        <div style={{
          textAlign: "center",
          padding: "var(--gap-md)",
          background: "rgba(15, 23, 42, 0.02)",
          borderRadius: "var(--radius-lg)"
        }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.875rem", fontWeight: "600" }}>
            📱 Certificate QR Code
          </p>
          <img
            className="qr-preview"
            src={result.qrCodeDataUrl}
            alt="Certificate QR code"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "var(--radius-md)",
              border: "2px solid var(--line)",
              padding: "0.5rem",
              background: "white",
              margin: "0 auto"
            }}
          />
        </div>
      )}

      <div style={{ marginTop: "var(--gap-md)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {result.ipfsUrl && (
          <a
            href={result.ipfsUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: "var(--primary)",
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem"
            }}
          >
            🔗 View on IPFS
          </a>
        )}

        {result.blockchainTxHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${result.blockchainTxHash}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid var(--line)",
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "var(--transition)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "var(--line)";
            }}
          >
            🌐 View on Etherscan
          </a>
        )}
      </div>
    </div>
  );
}

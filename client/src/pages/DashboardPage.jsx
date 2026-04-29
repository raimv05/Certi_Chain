import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, LabelList } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import BulkUploadForm from "../components/BulkUploadForm";
import CertificateTable from "../components/CertificateTable";
import IssueCertificateForm from "../components/IssueCertificateForm";
import StatCard from "../components/StatCard";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, LayoutDashboard, BarChart3, Loader2, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const { admin, logout } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [showRevoked, setShowRevoked] = useState(false);

  async function loadCertificates() {
    try {
      setLoading(true);
      const response = await api.get("/certificates");
      setCertificates(response.data.data);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke(certificateId) {
    try {
      setProcessingMessage("Revoking certificate... Please wait.");
      await api.patch(`/certificates/${certificateId}/revoke`);
      await loadCertificates();
    } catch (err) {
      console.error("Revocation failed:", err);
    } finally {
      setProcessingMessage(null);
    }
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  const analytics = [
    { label: "Valid", value: certificates.filter((item) => item.status === "valid").length },
    { label: "Revoked", value: certificates.filter((item) => item.status === "revoked").length },
  ];

  return (
    <main className="dashboard-shell animate-fade-in">
      <header className="animate-slide-down" style={{ 
        marginBottom: "var(--gap-xl)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        borderBottom: "1px solid var(--line)", 
        paddingBottom: "4rem",
        paddingTop: "2rem"
      }}>
        <div style={{ textAlign: "left", flex: 1 }}>
          <p className="eyebrow" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            margin: 0,
            fontSize: "1rem" 
          }}>
            <LayoutDashboard size={18} /> ENTERPRISE CERTIFICATE REGISTRY
          </p>
          
          <div style={{ overflow: "hidden", marginTop: "1rem" }}>
            <motion.h1 
              style={{ 
                fontSize: "4.5rem", 
                margin: 0, 
                fontWeight: "900", 
                letterSpacing: "-0.05em",
                lineHeight: 1,
                background: "linear-gradient(to right, #fff, #94a3b8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {"Admin Control Center".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: index * 0.05,
                    ease: "easeIn"
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="muted" 
            style={{ 
              marginTop: "1.5rem", 
              maxWidth: "700px", 
              fontSize: "1.2rem", 
              lineHeight: "1.6",
              marginBottom: 0 
            }}
          >
            Issue certificates, anchor hashes on Ethereum Sepolia, and manage your institution's credentials from one unified dashboard.
          </motion.p>
        </div>

        {/* 3D Floating Expert Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: 1,
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            opacity: { duration: 1 },
            x: { duration: 1 }
          }}
          style={{ 
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            marginRight: "2rem"
          }}
        >
          <div style={{ position: "relative" }}>
            <img 
              src="/assets/expert.png" 
              alt="Certification Expert" 
              style={{ 
                width: "220px", 
                height: "220px", 
                objectFit: "cover",
                borderRadius: "30px",
                boxShadow: "0 20px 40px rgba(0, 240, 255, 0.2), 0 0 0 1px var(--line)",
                border: "2px solid rgba(255,255,255,0.1)"
              }} 
            />
            
            {/* Assurance Badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                position: "absolute",
                bottom: "-15px",
                right: "-15px",
                background: "var(--success)",
                color: "#000",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 10px 20px rgba(0, 255, 157, 0.3)",
                border: "2px solid #000"
              }}
            >
              <ShieldCheck size={14} /> CERTIFIED ASSURANCE
            </motion.div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <p style={{ 
              fontSize: "0.8rem", 
              fontWeight: "700", 
              color: "var(--success)",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              Identity Verified
            </p>
          </div>
        </motion.div>
      </header>

      <section className="stats-grid animate-slide-up stagger-1">
        <StatCard label="Certificates Issued" value={certificates.length} total={100} accent="var(--primary)" />
        <StatCard label="Valid Credentials" value={analytics[0].value} total={certificates.length} accent="var(--secondary-light)" />
        <StatCard label="Revoked" value={analytics[1].value} total={certificates.length} accent="var(--danger)" />
      </section>

      <section className="content-grid animate-slide-up stagger-2">
        <IssueCertificateForm onIssued={loadCertificates} setGlobalProcessing={setProcessingMessage} />
        <BulkUploadForm onUploaded={loadCertificates} setGlobalProcessing={setProcessingMessage} />
      </section>

      <section className="panel chart-panel animate-slide-up stagger-3" style={{ marginBottom: "var(--gap-lg)" }}>
        <div className="table-header" style={{ marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="var(--primary)" /> Issuance Analytics
            </h3>
            <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.25rem" }}>Real-time certificate status distribution</p>
          </div>
        </div>
        <div style={{ marginTop: "var(--gap-md)" }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics} margin={{ top: 25, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="label" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis allowDecimals={false} stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
              <Bar dataKey="value" fill="url(#colorGradient)" radius={[12, 12, 0, 0]}>
                <LabelList dataKey="value" position="top" fill="var(--text-primary)" style={{ fontWeight: '600', fontSize: '1rem' }} />
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--secondary-light)" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {loading ? (
        <div style={{
          textAlign: "center",
          padding: "4rem",
          color: "var(--text-muted)"
        }} className="animate-fade-in">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ animation: "spin 1s linear infinite" }} />
          </div>
          Loading certificates...
        </div>
      ) : (
        <div className="animate-slide-up stagger-3">
          <CertificateTable 
            certificates={certificates}
            onRevoke={handleRevoke} 
            setGlobalProcessing={setProcessingMessage} 
          />
        </div>
      )}
      {processingMessage && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 6, 23, 0.9)", // Darker, more opaque background
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          color: "white",
          textAlign: "center"
        }} className="animate-fade-in">
          <div style={{
            background: "var(--bg-panel)",
            padding: "3.5rem 4rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--line-light)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            maxWidth: "500px",
            width: "90%"
          }}>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                inset: "-10px",
                background: "var(--primary)",
                filter: "blur(20px)",
                opacity: 0.3,
                borderRadius: "50%"
              }}></div>
              <Loader2 size={64} className="animate-spin" color="var(--primary)" style={{ animation: "spin 1.2s linear infinite", position: "relative" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>Action in Progress</h2>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>{processingMessage}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </main>
  );
}

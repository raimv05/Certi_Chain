import React from "react";
import { FileText, ShieldCheck, ShieldAlert, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function StatCard({ label, value, accent, total }) {
  const icons = {
    "Certificates Issued": <FileText size={24} />,
    "Valid Credentials": <ShieldCheck size={24} />,
    "Revoked": <ShieldAlert size={24} />,
  };

  const icon = icons[label] || <FileText size={24} />;
  
  const denominator = total || 100;
  const percentage = Math.min(100, (value / denominator) * 100);

  return (
    <motion.div 
      whileHover={{ 
        y: -5,
        scale: 1.02,
        rotateX: 5,
        rotateY: -5,
        transition: { duration: 0.2 }
      }}
      className="stat-card" 
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Background watermark icon */}
      <div style={{
        position: "absolute",
        bottom: "-10px",
        right: "-10px",
        opacity: 0.05,
        transform: "rotate(-15deg) translateZ(-10px)",
        color: accent,
        pointerEvents: "none"
      }}>
        {icon && React.cloneElement(icon, { size: 120 })}
      </div>

      {/* Background glow effect */}
      <div style={{
        position: "absolute",
        top: "-20px",
        right: "-20px",
        width: "120px",
        height: "120px",
        background: accent,
        filter: "blur(50px)",
        opacity: 0.1,
        borderRadius: "50%",
        pointerEvents: "none"
      }}></div>

      <div style={{ position: "relative", zIndex: 2, transform: "translateZ(20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div className="icon-box" style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "var(--transition)"
          }}>
            {icon}
          </div>
          <div className="arrow-container" style={{ color: "var(--text-muted)" }}>
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div>
          <p style={{ 
            color: "var(--text-secondary)", 
            fontSize: "0.85rem", 
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 0.5rem" 
          }}>
            {label}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <strong className="stat-value" style={{ 
              color: "white",
              fontSize: "3rem",
              background: "white",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              {value}
            </strong>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, marginTop: "1.5rem", transform: "translateZ(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          <span>{total ? "Distribution" : "Registry Capacity"}</span>
          <span style={{ color: accent, fontWeight: "600" }}>
            {Math.round(percentage)}%
          </span>
        </div>
        <div style={{ 
          height: "6px", 
          width: "100%", 
          background: "rgba(255,255,255,0.05)", 
          borderRadius: "3px",
          overflow: "hidden"
        }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ 
              height: "100%", 
              background: accent,
              boxShadow: `0 0 10px ${accent}80`,
              borderRadius: "3px"
            }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
}

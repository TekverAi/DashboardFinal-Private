import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { FileText, Eye, Search, Filter, X, BarChart3, ShieldAlert, CheckCircle2, Calendar, Database, Clock } from "lucide-react";

interface Report {
  id: string;
  title: string;
  repo: string;
  date: string;
  score: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const initialReports: Report[] = [
  { id: "RPT-2024-0310-1", title: "Full Security Audit — api-gateway", repo: "api-gateway", date: "Mar 10, 2026", score: 96, critical: 0, high: 0, medium: 1, low: 2 },
  { id: "RPT-2024-0310-2", title: "Authentication Security Review", repo: "auth-service", date: "Mar 10, 2026", score: 72, critical: 0, high: 2, medium: 1, low: 0 },
  { id: "RPT-2024-0309-1", title: "Quarterly Compliance Report", repo: "payment-core", date: "Mar 09, 2026", score: 41, critical: 1, high: 4, medium: 3, low: 0 },
  { id: "RPT-2024-0308-1", title: "Dependency Vulnerability Scan", repo: "user-service", date: "Mar 08, 2026", score: 88, critical: 0, high: 0, medium: 2, low: 1 },
  { id: "RPT-2024-0307-1", title: "Architecture Risk Assessment", repo: "analytics-engine", date: "Mar 07, 2026", score: 79, critical: 0, high: 1, medium: 2, low: 3 },
];

export default function Reports() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22C55E";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const filteredReports = initialReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.repo.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "critical") return matchesSearch && report.critical > 0;
    if (filterType === "secure") return matchesSearch && report.score >= 90;
    return matchesSearch;
  });

  const handleViewReport = (id: string) => {
    const report = initialReports.find(r => r.id === id);
    if (report) {
      setSelectedReport(report);
      showToast(`Opening report ${id} for interactive review...`, "info");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            Verification Reports
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Generated AI analysis reports and security audits
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flex: 1, justifyContent: "flex-end", minWidth: "300px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "260px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Filter reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 16px 9px 38px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-dashboard)",
                outline: "none"
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: "9px 16px 9px 34px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                fontFamily: "var(--font-dashboard)",
                appearance: "none",
                outline: "none"
              }}
            >
              <option value="all">All Reports</option>
              <option value="critical">Critical Issues</option>
              <option value="secure">High Score</option>
            </select>
            <Filter size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              padding: "22px 24px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              cursor: "default",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(0,229,255,0.3)";
              el.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--color-border-subtle)";
              el.style.transform = "translateX(0)";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(0,229,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={20} style={{ color: "var(--color-accent)" }} />
            </div>

            <div style={{ flex: 1, minWidth: "160px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "5px" }}>
                {report.title}
              </h3>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                  {report.repo}
                </span>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{report.date}</span>
              </div>
            </div>

            {/* Issue counts */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              {report.critical > 0 && (
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)", padding: "2px 8px", borderRadius: "99px", letterSpacing: "0.02em" }}>
                  {report.critical} CRITICAL
                </span>
              )}
              {report.high > 0 && (
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", padding: "2px 8px", borderRadius: "99px", letterSpacing: "0.02em" }}>
                  {report.high} HIGH
                </span>
              )}
              {report.medium > 0 && (
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.3)", padding: "2px 8px", borderRadius: "99px", letterSpacing: "0.02em" }}>
                  {report.medium} MEDIUM
                </span>
              )}
              {report.critical === 0 && report.high === 0 && (
                <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-success)", border: "1px solid rgba(34,197,94,0.3)", padding: "2px 8px", borderRadius: "99px", letterSpacing: "0.02em" }}>
                  STABLE
                </span>
              )}
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "800",
                color: report.score >= 80 ? "#22C55E" : report.score >= 60 ? "#F59E0B" : "#EF4444",
                fontFamily: "var(--font-mono)",
                flexShrink: 0,
                textAlign: "right",
                minWidth: "60px"
              }}
            >
              {report.score}
              <div style={{ fontSize: "10px", fontWeight: "400", color: "var(--color-text-muted)" }}>score</div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => handleViewReport(report.id)}
                style={{
                  padding: "7px 14px",
                  background: "rgba(0,229,255,0.06)",
                  border: "1px solid rgba(0,229,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "var(--font-dashboard)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(0,229,255,0.12)";
                  el.style.borderColor = "rgba(0,229,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(0,229,255,0.06)";
                  el.style.borderColor = "rgba(0,229,255,0.2)";
                }}
              >
                <Eye size={14} />
                View Report
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
          No reports found matching your criteria.
        </div>
      )}

      <AnimatePresence>
        {selectedReport && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              style={{
                width: "100%",
                maxWidth: "700px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "24px",
                position: "relative",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,229,255,0.2) transparent"
              }}
              className="custom-modal-scroll"
            >
              <style>{`
                .custom-modal-scroll::-webkit-scrollbar {
                  width: 5px;
                }
                .custom-modal-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-modal-scroll::-webkit-scrollbar-thumb {
                  background-color: rgba(255, 255, 255, 0.05);
                  border-radius: 20px;
                }
                .custom-modal-scroll::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(0, 229, 255, 0.2);
                }
              `}</style>
              {/* Modal Header */}
              <div className="flex justify-between items-start gap-4 p-6 border-b border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(0,229,255,0.1)] flex items-center justify-center shrink-0">
                    <FileText size={24} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-1 truncate">{selectedReport.title}</h3>
                    <div className="flex gap-3 items-center flex-wrap">
                      <span className="text-[13px] text-[var(--color-text-muted)] flex items-center gap-1 min-w-0"><Database size={14} className="shrink-0" /> <span className="truncate max-w-[120px] sm:max-w-none">{selectedReport.repo}</span></span>
                      <span className="text-[13px] text-[var(--color-text-muted)] flex items-center gap-1 shrink-0"><Calendar size={14} /> {selectedReport.date}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="w-8 h-8 flex items-center justify-center rounded-full border-none cursor-pointer shrink-0" style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-text-muted)" }}>
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "32px" }}>
                {/* Score Overview */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-[40px] mb-8 p-6 w-full rounded-[20px] bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-subtle)]">
                  <div className="relative w-[100px] h-[100px] flex items-center justify-center shrink-0">
                    <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="transparent" stroke={getScoreColor(selectedReport.score)} strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * selectedReport.score) / 100} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
                    </svg>
                    <div style={{ position: "absolute", textAlign: "center" }}>
                      <div style={{ fontSize: "28px", fontWeight: "800", color: getScoreColor(selectedReport.score), fontFamily: "var(--font-mono)" }}>{selectedReport.score}</div>
                      <div style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Score</div>
                    </div>
                  </div>
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Vulnerabilities</span>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ padding: "2px 8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "99px", fontSize: "12px", fontWeight: "700", color: "#EF4444" }}>{selectedReport.critical} CRIT</div>
                        <div style={{ padding: "2px 8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "99px", fontSize: "12px", fontWeight: "700", color: "#F59E0B" }}>{selectedReport.high} HIGH</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Analysis Speed</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-text-primary)", fontSize: "15px", fontWeight: "600" }}>
                        <Clock size={16} style={{ color: "var(--color-accent)" }} /> 1.2s avg.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Summary */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    <BarChart3 size={18} style={{ color: "var(--color-accent)" }} /> AI Analysis Executive Summary
                  </div>
                  <div style={{ padding: "20px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--color-border-subtle)", borderRadius: "16px", lineHeight: "1.7", color: "var(--color-text-secondary)", fontSize: "14px" }}>
                    The automated verification of <strong>{selectedReport.repo}</strong> has identified several security considerations.
                    The architecture demonstrates {selectedReport.score > 80 ? "strong adherence to security best practices" : "areas requiring immediate remediation"}.
                    Specifically, {selectedReport.critical > 0 ? `we detected ${selectedReport.critical} critical vulnerability that bypasses standard auth guards` : "all core authentication pathways are properly protected"}.
                    We recommend a manual review of the data ingestion pipelines near recent commits in the <em>{selectedReport.repo}</em> repository.
                  </div>
                </div>

                {/* Key Findings List */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    <ShieldAlert size={18} style={{ color: "#EF4444" }} /> Key Risk Findings
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { title: "Dependency Vulnerability", level: "Medium", desc: "Outdated encryption sub-dependency in package core." },
                      { title: "Missing Authorization", level: "High", desc: "API endpoint /v1/logs lacks proper role checking." },
                      { title: "Insecure Headers", level: "Low", desc: "CSP policy is overly permissive for external scripts." }
                    ].map((finding, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-3 p-[14px] px-[18px] bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-subtle)] rounded-xl">
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[var(--color-text-primary)] break-words">{finding.title}</div>
                          <div className="text-[11px] text-[var(--color-text-muted)] mt-1 leading-relaxed break-words">{finding.desc}</div>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase shrink-0 mt-0.5" style={{ color: finding.level === "High" ? "#EF4444" : "#F59E0B" }}>{finding.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedReport(null)}
                    style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border-subtle)", borderRadius: "12px", color: "var(--color-text-primary)", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                  >
                    Close Report
                  </button>
                  <button
                    onClick={() => {
                      showToast("Exporting detailed PDF report...", "info");
                      setSelectedReport(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "var(--color-accent)",
                      border: "none",
                      borderRadius: "12px",
                      color: "var(--color-bg-primary)",
                      fontSize: "14px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <CheckCircle2 size={18} /> Confirm Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

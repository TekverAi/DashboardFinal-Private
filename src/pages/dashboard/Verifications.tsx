import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Download, 
  Search, 
  Plus, 
  Terminal, 
  X, 
  Link2, 
  Zap, 
  ShieldAlert,
  History,
  Activity,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

const initialVerificationsData = [
  { id: "VRF-2401", repo: "api-gateway", branch: "main", score: 96, status: "secure", issues: 0, duration: "1.8s", date: "2 min ago" },
  { id: "VRF-2400", repo: "auth-service", branch: "develop", score: 72, status: "warning", issues: 3, duration: "2.1s", date: "18 min ago" },
  { id: "VRF-2399", repo: "payment-core", branch: "main", score: 41, status: "critical", issues: 8, duration: "3.4s", date: "1 hour ago" },
  { id: "VRF-2398", repo: "user-service", branch: "feature/auth", score: 88, status: "secure", issues: 1, duration: "1.5s", date: "3 hours ago" },
  { id: "VRF-2397", repo: "notification-svc", branch: "main", score: 91, status: "secure", issues: 0, duration: "0.9s", date: "5 hours ago" },
  { id: "VRF-2396", repo: "analytics-engine", branch: "main", score: 79, status: "warning", issues: 2, duration: "4.2s", date: "12 hours ago" },
];

export default function Verifications() {
  const { showToast } = useToast();
  const [verifications, setVerifications] = useState(initialVerificationsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScanModal, setShowScanModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  const filteredVerifications = verifications.filter(v => 
    v.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateGithubLink = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(\/)?$/;
    return regex.test(url);
  };

  const handleStartScan = async () => {
    if (!repoUrl.trim()) {
      showToast("Please enter a GitHub repository URL.", "error");
      return;
    }
    if (!validateGithubLink(repoUrl)) {
      showToast("Invalid GitHub repository URL format.", "error");
      return;
    }

    setIsScanning(true);
    showToast("Initializing AI verification pipeline...", "info");

    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'unknown-repo';

    // Simulate analysis steps
    await new Promise(r => setTimeout(r, 1500));
    showToast("Analyzing security context...", "info");
    await new Promise(r => setTimeout(r, 1500));
    showToast("Mapping dependency vulnerabilities...", "info");
    await new Promise(r => setTimeout(r, 1000));

    const newScan = {
      id: `VRF-${verifications.length + 2401}`,
      repo: repoName,
      branch: "main",
      score: 84,
      status: "secure",
      issues: 12,
      duration: "2.4s",
      date: "just now"
    };

    setVerifications([newScan, ...verifications]);
    setIsScanning(false);
    setShowScanModal(false);
    setRepoUrl("");
    showToast(`Verification for ${repoName} completed.`, "success");
  };

  const handleDownloadReport = (v: any) => {
    showToast(`Preparing data export for ${v.repo}...`, "info");
    
    // Simulate generation delay
    setTimeout(() => {
      try {
        // Construct CSV content
        const headers = ["Run ID", "Repository", "Branch", "Score", "Duration", "Status", "Issues", "Date"];
        const rowData = [
          v.id,
          v.repo,
          v.branch,
          v.score,
          v.duration,
          v.status,
          v.issues || 0,
          v.date
        ];
        
        const csvContent = [headers, rowData].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `verification_report_${v.id}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast(`Verification report ${v.id}.csv downloaded.`, "success");
      } catch (err) {
        showToast("Download failed. Please try again.", "error");
        console.error("Export error:", err);
      }
    }, 1200);
  };

  const handleOpenRawLogs = (id: string) => {
    showToast(`Streaming raw telemetry logs for ${id}...`, "info");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            Verifications
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Deep-audit history & automated security scoring
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "10px", flex: 1, justifyContent: "flex-end", minWidth: "300px" }}>
           <div style={{ position: "relative", flex: 1, maxWidth: "260px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              <input 
                type="text"
                placeholder="Search runs..."
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
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border-subtle)")}
              />
           </div>
           <button 
             onClick={() => setShowScanModal(true)}
             style={{
               padding: "9px 16px",
               background: "var(--color-accent)",
               border: "none",
               borderRadius: "8px",
               fontSize: "13px",
               color: "var(--color-bg-primary)",
               fontWeight: "800",
               cursor: "pointer",
               display: "flex",
               alignItems: "center",
               gap: "8px",
               fontFamily: "var(--font-dashboard)",
               boxShadow: "0 4px 12px rgba(0,229,255,0.15)",
               transition: "all 0.2s ease"
             }}
             onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
             onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
           >
             <Plus size={15} />
             New Scan
           </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Successful Runs", value: "2,401", icon: CheckCircle2, color: "var(--color-success)", bg: "rgba(34,197,94,0.08)" },
          { label: "Critical Risks", value: "184", icon: ShieldAlert, color: "var(--color-danger)", bg: "rgba(239,68,68,0.08)" },
          { label: "Engine Efficiency", value: "2.3s", icon: Zap, color: "var(--color-accent)", bg: "rgba(0,229,255,0.08)" },
          { label: "Active Monitors", value: "24", icon: Activity, color: "#818CF8", bg: "rgba(129,140,248,0.08)" },
        ].map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-professional"
            style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px" }}
          >
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", lineHeight: "1" }}>{value}</div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", marginTop: "4px", textTransform: "uppercase" }}>{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Audit Log Table-like View */}
      <div className="card-professional" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.01)" }}>
          <History size={16} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>Verification History Audit</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          {filteredVerifications.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "14px" }}>
               No verification runs found matching your search.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--color-border-subtle)" }}>
                  {["RUN ID", "REPOSITORY", "BRANCH", "SCORE", "ELAPSED", "STATUS", "ACTIONS"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: "800", color: "var(--color-text-muted)", letterSpacing: "0.1em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.map((v, i) => {
                  const scoreColor = v.score >= 80 ? "var(--color-success)" : v.score >= 60 ? "var(--color-warning)" : "var(--color-danger)";
                  return (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: i < filteredVerifications.length - 1 ? "1px solid var(--color-border-subtle)" : "none", transition: "all 0.2s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.015)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontWeight: "600" }}>#{v.id}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: "14px", color: "var(--color-text-primary)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>{v.repo}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{v.branch}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "800", color: scoreColor, fontFamily: "var(--font-mono)" }}>{v.score}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>{v.duration}</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                           <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: scoreColor }} />
                           <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase" }}>{v.status}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadReport(v);
                            }}
                            style={{ 
                              padding: "7px 14px", 
                              background: "rgba(34,197,94,0.08)", 
                              border: "1px solid rgba(34,197,94,0.2)", 
                              borderRadius: "8px", 
                              color: "var(--color-success)", 
                              fontSize: "12px", 
                              fontWeight: "700", 
                              cursor: "pointer", 
                              display: "flex", 
                              alignItems: "center", 
                              gap: "8px",
                              transition: "all 0.2s ease",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(34,197,94,0.15)";
                              e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(34,197,94,0.08)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                            onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(0) scale(0.98)")}
                            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(-1px) scale(1)")}
                          >
                            <Download size={14} /> 
                            <span>Excel</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Scan Modal */}
      <AnimatePresence>
        {showScanModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isScanning && setShowScanModal(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(6px)" }} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card-professional"
              style={{ width: "100%", maxWidth: "450px", padding: 0, position: "relative", overflow: "hidden" }}
            >
              <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)" }}>New Verification Run</h3>
                <button onClick={() => !isScanning && setShowScanModal(false)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--color-text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Target Repository URL</label>
                  <div style={{ position: "relative" }}>
                    <Link2 size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                    <input 
                      type="text"
                      placeholder="https://github.com/user/repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      disabled={isScanning}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 38px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--color-border-subtle)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-mono)",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "12px" }}>
                    <button 
                      onClick={() => setShowScanModal(false)}
                      disabled={isScanning}
                      style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border-subtle)", borderRadius: "10px", color: "var(--color-text-secondary)", fontSize: "14px", fontWeight: "700", cursor: isScanning ? "not-allowed" : "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartScan}
                      disabled={isScanning}
                      style={{
                        flex: 2,
                        padding: "14px",
                        background: isScanning ? "var(--color-surface)" : "var(--color-accent)",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: "800",
                        color: isScanning ? "var(--color-text-muted)" : "var(--color-bg-primary)",
                        cursor: isScanning ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                      }}
                    >
                      {isScanning ? <Zap size={18} className="animate-pulse" /> : <ShieldCheck size={18} />}
                      {isScanning ? "VERIFYING..." : "START SCAN"}
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

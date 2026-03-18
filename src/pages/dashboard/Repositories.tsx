import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import {
  GitBranch,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  X,
  Link2,
  ShieldCheck,
  ExternalLink,
  Shield,
  Zap,
  Lock,
  Activity
} from "lucide-react";

const initialReposData = [
  { id: "1", name: "api-gateway", lang: "TypeScript", score: 96, status: "secure", lastScan: "2m ago", size: "124 MB", issues: 0 },
  { id: "2", name: "auth-service", lang: "Go", score: 72, status: "warning", lastScan: "18m ago", size: "45 MB", issues: 3 },
  { id: "3", name: "payment-core", lang: "Java", score: 41, status: "critical", lastScan: "1h ago", size: "280 MB", issues: 8 },
  { id: "4", name: "user-service", lang: "Python", score: 88, status: "secure", lastScan: "3h ago", size: "67 MB", issues: 1 },
  { id: "5", name: "notification-svc", lang: "TypeScript", score: 91, status: "secure", lastScan: "5h ago", size: "33 MB", issues: 0 },
  { id: "6", name: "analytics-engine", lang: "Rust", score: 79, status: "warning", lastScan: "12h ago", size: "190 MB", issues: 2 },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "secure") return <CheckCircle2 size={16} style={{ color: "#22C55E" }} />;
  if (status === "warning") return <AlertTriangle size={16} style={{ color: "#F59E0B" }} />;
  return <AlertTriangle size={16} style={{ color: "#EF4444" }} />;
}

export default function Repositories() {
  const { showToast } = useToast();
  const [repos, setRepos] = useState(initialReposData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [scanningRepos, setScanningRepos] = useState<string[]>([]);

  // Modals state
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState<any>(null);

  // Connection state
  const [repoUrl, setRepoUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScanAll = () => {
    setIsScanningAll(true);
    showToast("Starting collective scan for all repositories...", "info");
    setTimeout(() => {
      setRepos(prev => prev.map(r => ({ ...r, lastScan: "just now", lastUpdated: Date.now() })));
      setIsScanningAll(false);
      showToast("All repositories scanned successfully.", "success");
    }, 4000);
  };

  const validateGithubLink = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(\/)?$/;
    return regex.test(url);
  };

  const handleConnectRepo = async () => {
    if (!repoUrl.trim()) {
      showToast("Please enter a GitHub repository URL.", "error");
      return;
    }
    if (!validateGithubLink(repoUrl)) {
      showToast("Invalid GitHub repository URL format.", "error");
      return;
    }

    setIsConnecting(true);
    showToast("Establishing connection to GitHub...", "info");

    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'unknown-repo';

    // Simulate analysis
    await new Promise(r => setTimeout(r, 2000));
    showToast(`Analyzing ${repoName} code patterns...`, "info");
    await new Promise(r => setTimeout(r, 2000));

    const newRepo = {
      id: Math.random().toString(36).substr(2, 9),
      name: repoName,
      lang: "Detecting...",
      score: 85,
      status: "secure",
      lastScan: "just now",
      size: "Calculating...",
      issues: 0
    };

    setRepos([newRepo, ...repos]);
    setIsConnecting(false);
    setShowConnectModal(false);
    setRepoUrl("");
    showToast(`${repoName} connected and verified successfully!`, "success");
  };

  const handleIndividualScan = (id: string, name: string) => {
    setScanningRepos(prev => [...prev, id]);
    showToast(`Scanning ${name}...`, "info");
    setTimeout(() => {
      setRepos(prev => prev.map(r => r.id === id ? { ...r, lastScan: "just now", status: "secure", score: Math.min(r.score + 2, 98) } : r));
      setScanningRepos(prev => prev.filter(r => r !== id));
      showToast(`Scan complete: No new vulnerabilities in ${name}.`, "success");
    }, 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            Repositories
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            {repos.length} total repositories connected
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-[10px] flex-1 w-full sm:w-auto sm:justify-end sm:min-w-[300px]">
          <div className="flex gap-[10px] w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={handleScanAll}
              disabled={isScanningAll}
              className="flex-1 sm:flex-none flex items-center justify-center gap-[6px]"
              style={{
                padding: "9px 16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                cursor: isScanningAll ? "not-allowed" : "pointer",
                fontFamily: "var(--font-dashboard)",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => !isScanningAll && (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onMouseLeave={(e) => !isScanningAll && (e.currentTarget.style.borderColor = "var(--color-border-subtle)")}
            >
              <RefreshCw size={14} className={isScanningAll ? "animate-spin" : ""} />
              {isScanningAll ? "Scanning..." : "Scan All"}
            </button>
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-[6px]"
              style={{
                padding: "9px 16px",
                background: "var(--color-accent)",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                color: "var(--color-bg-primary)",
                cursor: "pointer",
                fontFamily: "var(--font-dashboard)",
                fontWeight: "800",
                boxShadow: "0 4px 12px rgba(0,229,255,0.15)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <Plus size={15} />
              Connect
            </button>
          </div>

          <div className="relative flex-1 w-full sm:max-w-[300px] order-2 sm:order-1">
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Search repositories..."
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
        </div>
      </div>

      {/* Repo List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredRepos.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", background: "var(--color-surface)", borderRadius: "14px", border: "1px dashed var(--color-border-subtle)" }}>
            <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>No repositories found matching your search.</p>
          </div>
        ) : (
          filteredRepos.map((repo, i) => {
            const isScanning = scanningRepos.includes(repo.id) || isScanningAll;
            return (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card-professional"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: isScanning ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <GitBranch size={16} style={{ color: isScanning ? "var(--color-accent)" : "var(--color-text-muted)" }} />
                </div>

                <div style={{ flex: 1, minWidth: "150px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}>
                      {repo.name}
                    </span>
                    <StatusIcon status={isScanning ? "scanning" : repo.status} />
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{repo.lang}</span>
                    <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--color-border-subtle)" }} />
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{repo.size}</span>
                    <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--color-border-subtle)" }} />
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={10} />
                      {repo.lastScan}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "24px", alignItems: "center", marginRight: "16px" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: isScanning ? "var(--color-text-muted)" : (repo.score >= 80 ? "var(--color-success)" : repo.score >= 60 ? "var(--color-warning)" : "var(--color-danger)"),
                      fontFamily: "var(--font-mono)",
                      lineHeight: "1"
                    }}>
                      {isScanning ? "--" : repo.score}
                    </div>
                    <div style={{ fontSize: "9px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", marginTop: "2px" }}>Score</div>
                  </div>

                  <div style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: isScanning ? "rgba(255,255,255,0.02)" : (repo.issues === 0 ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)"),
                    border: `1px solid ${isScanning ? "transparent" : (repo.issues === 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)")}`,
                    color: isScanning ? "var(--color-text-muted)" : (repo.issues === 0 ? "var(--color-success)" : "var(--color-danger)"),
                    fontSize: "11px",
                    fontWeight: "600",
                  }}>
                    {isScanning ? "---" : `${repo.issues} issues`}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleIndividualScan(repo.id, repo.name)}
                    disabled={isScanning}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "var(--color-text-secondary)",
                      cursor: isScanning ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-dashboard)",
                      fontWeight: "700",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => !isScanning && (e.currentTarget.style.borderColor = "var(--color-accent)")}
                    onMouseLeave={(e) => !isScanning && (e.currentTarget.style.borderColor = "var(--color-border-subtle)")}
                  >
                    Scan
                  </button>
                  <button
                    onClick={() => setShowReportModal(repo)}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(0,229,255,0.05)",
                      border: "1px solid rgba(0,229,255,0.1)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "var(--color-accent)",
                      cursor: "pointer",
                      fontFamily: "var(--font-dashboard)",
                      fontWeight: "700",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.05)")}
                  >
                    Report
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isConnecting && setShowConnectModal(false)}
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
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)" }}>Connect Repository</h3>
                <button onClick={() => !isConnecting && setShowConnectModal(false)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--color-text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>GitHub Repository URL</label>
                  <div style={{ position: "relative" }}>
                    <Link2 size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                    <input
                      type="text"
                      placeholder="https://github.com/user/repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      disabled={isConnecting}
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
                  <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "8px" }}>
                    We'll clone and analyze the codebase for security vulnerabilities and architectural patterns.
                  </p>
                </div>

                <button
                  onClick={handleConnectRepo}
                  disabled={isConnecting}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: isConnecting ? "var(--color-surface)" : "var(--color-accent)",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "800",
                    color: isConnecting ? "var(--color-text-muted)" : "var(--color-bg-primary)",
                    cursor: isConnecting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                >
                  {isConnecting ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {isConnecting ? "ANALYZING CODE..." : "CONNECT & ANALYZE"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(null)}
              style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(6px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="card-professional"
              style={{ width: "100%", maxWidth: "600px", padding: 0, position: "relative", maxHeight: "90vh", overflowY: "auto" }}
            >
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(0,229,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Shield size={18} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)" }}>Verification Report</h3>
                    <p style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>{showReportModal.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowReportModal(null)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Score Hero */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,229,255,0.02))",
                  borderRadius: "16px",
                  padding: "30px",
                  border: "1px solid var(--color-border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "24px"
                }}>
                  <div style={{
                    fontSize: "48px",
                    fontWeight: "900",
                    color: showReportModal.score >= 80 ? "var(--color-success)" : showReportModal.score >= 60 ? "var(--color-warning)" : "var(--color-danger)",
                    fontFamily: "var(--font-mono)",
                    lineHeight: "1"
                  }}>
                    {showReportModal.score}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", marginTop: "4px", letterSpacing: "0.1em" }}>Security Score</div>
                  <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "16px", maxWidth: "340px" }}>
                    {showReportModal.score >= 80
                      ? "Excellent security posture. No high-risk vulnerabilities detected in the core logic."
                      : "Requires attention. We've identified potential exploitation paths in dependencies."}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border-subtle)", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <Zap size={14} style={{ color: "var(--color-accent)" }} />
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-text-primary)" }}>Insights</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Language</span>
                        <span style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>{showReportModal.lang}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Storage Size</span>
                        <span style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>{showReportModal.size}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border-subtle)", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <Activity size={14} style={{ color: "var(--color-danger)" }} />
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-text-primary)" }}>Risks</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Active Issues</span>
                        <span style={{ color: showReportModal.issues > 0 ? "var(--color-danger)" : "var(--color-success)", fontWeight: "600" }}>{showReportModal.issues} detected</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Last Scan</span>
                        <span style={{ color: "var(--color-text-primary)", fontWeight: "600" }}>{showReportModal.lastScan}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setShowReportModal(null)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "10px",
                      color: "var(--color-text-primary)",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowReportModal(null);
                      showToast("Report verification acknowledged.", "success");
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "var(--color-accent)",
                      border: "none",
                      borderRadius: "10px",
                      color: "var(--color-bg-primary)",
                      fontSize: "13px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    Done
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

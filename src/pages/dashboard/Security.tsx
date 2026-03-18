import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { AlertTriangle, ChevronRight, Filter, Search, CheckCircle2, ShieldAlert, X, Terminal, Code2, ShieldCheck, Zap } from "lucide-react";

interface Threat {
  id: string;
  severity: string;
  title: string;
  file: string;
  line: number;
  repo: string;
  status: string;
  desc: string;
}

const initialThreats = [
  { id: "VLN-001", severity: "CRITICAL", title: "SQL Injection Vulnerability", file: "src/api/users.ts", line: 142, repo: "api-gateway", status: "open", desc: "Unsanitized user input directly interpolated into SQL query." },
  { id: "VLN-002", severity: "HIGH", title: "Exposed API Secret", file: "config/env.js", line: 8, repo: "auth-service", status: "open", desc: "API key hardcoded and exposed in public configuration file." },
  { id: "VLN-003", severity: "HIGH", title: "Weak JWT Algorithm", file: "auth/jwt.ts", line: 34, repo: "auth-service", status: "open", desc: "Using deprecated HS256 algorithm without proper secret rotation." },
  { id: "VLN-004", severity: "MEDIUM", title: "Cross-Site Scripting", file: "views/render.tsx", line: 88, repo: "payment-core", status: "in-review", desc: "User-controlled content rendered without sanitization." },
  { id: "VLN-005", severity: "MEDIUM", title: "Race Condition", file: "services/payment.ts", line: 220, repo: "payment-core", status: "open", desc: "Concurrent payment operations not protected with mutex." },
  { id: "VLN-006", severity: "LOW", title: "Outdated Dependency", file: "package.json", line: 12, repo: "user-service", status: "resolved", desc: "lodash@4.17.15 has known prototype pollution vulnerability." },
];

const severityConfig: Record<string, { color: string; bg: string; icon: any }> = {
  CRITICAL: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: ShieldAlert },
  HIGH: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: AlertTriangle },
  MEDIUM: { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", icon: InfoIcon },
  LOW: { color: "#22C55E", bg: "rgba(34,197,94,0.1)", icon: CheckCircle2 },
};

function InfoIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  );
}

const statusBadge: Record<string, { color: string }> = {
  open: { color: "#EF4444" },
  "in-review": { color: "#F59E0B" },
  resolved: { color: "#22C55E" },
};

export default function Security() {
  const { showToast } = useToast();
  const [threats, setThreats] = useState(initialThreats);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  const filteredThreats = threats.filter((t: Threat) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterSeverity === "ALL") return matchesSearch;
    return matchesSearch && t.severity === filterSeverity;
  });

  const critical = threats.filter((t: Threat) => t.severity === "CRITICAL").length;
  const high = threats.filter((t: Threat) => t.severity === "HIGH").length;
  const medium = threats.filter((t: Threat) => t.severity === "MEDIUM").length;
  const low = threats.filter((t: Threat) => t.severity === "LOW").length;

  const handleExport = () => {
    showToast("Downloading security summary report...", "info");
    const headers = ["ID", "Severity", "Title", "File", "Line", "Repository", "Status", "Description"];
    const csvContent = [
      headers.join(","),
      ...threats.map((t: Threat) => [
        t.id,
        t.severity,
        `"${t.title.replace(/"/g, '""')}"`,
        t.file,
        t.line,
        t.repo,
        t.status,
        `"${t.desc.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `security_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResolveThreat = (id: string) => {
    showToast(`Marking ${id} as resolved...`, "info");
    setTimeout(() => {
      setThreats((prev: Threat[]) => prev.map((t: Threat) => t.id === id ? { ...t, status: "resolved" } : t));
      showToast(`Vulnerability ${id} has been moved to resolved status.`, "success");
    }, 1500);
  };

  const handleInvestigate = (id: string) => {
    const threat = threats.find((t: Threat) => t.id === id);
    if (threat) {
      setSelectedThreat(threat);
      showToast(`Opening AI Debugger for ${id}: ${threat.title}...`, "info");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            Security Intelligence
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Active threats and vulnerability analysis
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px", flex: 1, justifyContent: "flex-end", minWidth: "300px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "260px" }}>
             <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
             <input 
               type="text"
               placeholder="Search vulnerabilities..."
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
          <button 
            onClick={handleExport}
            style={{
              padding: "9px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "8px",
              color: "var(--color-text-primary)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "var(--font-dashboard)"
            }}
          >
            Export Logs
          </button>
        </div>
      </div>

      {/* Severity summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
        {[
          { label: "Critical", count: critical, type: "CRITICAL", ...severityConfig.CRITICAL },
          { label: "High", count: high, type: "HIGH", ...severityConfig.HIGH },
          { label: "Medium", count: medium, type: "MEDIUM", ...severityConfig.MEDIUM },
          { label: "Low", count: low, type: "LOW", ...severityConfig.LOW },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, backgroundColor: s.bg.replace("0.1", "0.15") }}
            onClick={() => setFilterSeverity(s.type === filterSeverity ? "ALL" : s.type)}
            transition={{ delay: i * 0.05 }}
            style={{
              padding: "20px",
              background: s.bg,
              border: filterSeverity === s.type ? `2px solid ${s.color}` : `1px solid ${s.color}30`,
              borderRadius: "16px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
             <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                <s.icon size={20} style={{ color: s.color }} />
             </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: s.color, fontFamily: "var(--font-mono)", lineHeight: "1" }}>
              {s.count}
            </div>
            <div style={{ fontSize: "12px", color: s.color, fontWeight: "700", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Threat list */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--color-border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.01)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldAlert size={16} style={{ color: "#EF4444" }} />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)" }}>
              Vulnerability Feed {filterSeverity !== "ALL" && `— Filtering ${filterSeverity}`}
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
             <button
               onClick={() => { 
                 setFilterSeverity("ALL"); 
                 setSearchQuery(""); 
                 showToast("Filters cleared", "info");
               }}
               style={{
                 padding: "6px 12px",
                 background: "transparent",
                 border: "1px solid var(--color-border-subtle)",
                 borderRadius: "7px",
                 fontSize: "11px",
                 color: "var(--color-text-muted)",
                 cursor: "pointer"
               }}
             >
               Reset Clear
             </button>
          </div>
        </div>

        {filteredThreats.map((threat: Threat, i: number) => {
          const sev = severityConfig[threat.severity];
          const st = statusBadge[threat.status];
          return (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex flex-col sm:flex-row items-start gap-4 p-5 transition-all duration-200"
              style={{
                borderBottom: i < filteredThreats.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.02)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
              }}
            >
              <div className="flex gap-4 w-full sm:w-auto items-start">
                <div
                  style={{
                    minWidth: "72px",
                    padding: "4px 0",
                    textAlign: "center",
                    background: sev.bg,
                    border: `1px solid ${sev.color}30`,
                    borderRadius: "6px",
                    fontSize: "9px",
                    fontWeight: "800",
                    color: sev.color,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase"
                  }}
                >
                  {threat.severity}
                </div>
              </div>

              <div className="flex-1 w-full relative">
                <div className="flex items-center gap-[10px] mb-1.5 flex-wrap">
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--color-text-primary)" }}>
                    {threat.title}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: st.color,
                      background: `${st.color}15`,
                      padding: "2px 8px",
                      borderRadius: "99px",
                      border: `1px solid ${st.color}30`,
                      letterSpacing: "0.02em"
                    }}
                  >
                    {threat.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "12px", lineHeight: "1.6" }}>
                  {threat.desc}
                </p>
                <div className="flex gap-5 flex-wrap items-center">
                  <div className="flex items-center gap-1.5">
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-accent)" }}></div>
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                      {threat.file}:{threat.line}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.03)", padding: "2px 6px", borderRadius: "4px" }}>
                    {threat.repo}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontWeight: "500" }}>
                    ID: {threat.id}
                  </span>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                 <button 
                   onClick={() => handleResolveThreat(threat.id)}
                   disabled={threat.status === "resolved"}
                   className="flex-1 sm:flex-none"
                   style={{
                     padding: "6px 14px",
                     background: threat.status === "resolved" ? "rgba(255,255,255,0.05)" : "rgba(34,197,94,0.1)",
                     border: `1px solid ${threat.status === "resolved" ? "var(--color-border-subtle)" : "rgba(34,197,94,0.3)"}`,
                     borderRadius: "7px",
                     fontSize: "12px",
                     color: threat.status === "resolved" ? "var(--color-text-muted)" : "#22C55E",
                     cursor: threat.status === "resolved" ? "not-allowed" : "pointer",
                     fontWeight: "600",
                     transition: "all 0.2s ease"
                   }}
                 >
                   Resolve
                 </button>
                 <button 
                   onClick={() => handleInvestigate(threat.id)}
                   className="flex-1 sm:flex-none"
                   style={{
                     padding: "6px 14px",
                     background: "rgba(255,255,255,0.03)",
                     border: "1px solid var(--color-border-subtle)",
                     borderRadius: "7px",
                     fontSize: "12px",
                     color: "var(--color-text-secondary)",
                     cursor: "pointer",
                     transition: "all 0.2s ease"
                   }}
                 >
                   Inspect
                 </button>
              </div>
            </motion.div>
          );
        })}
        
        {filteredThreats.length === 0 && (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ marginBottom: "12px", color: "var(--color-text-muted)" }}>
               <ShieldAlert size={40} style={{ opacity: 0.2, margin: "0 auto" }} />
            </div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
              No vulnerabilities found matching your current filters.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedThreat && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedThreat(null)}
              style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              style={{
                width: "100%",
                maxWidth: "600px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                   <div style={{ padding: "8px", borderRadius: "10px", background: severityConfig[selectedThreat.severity].bg }}>
                     <ShieldAlert size={20} style={{ color: severityConfig[selectedThreat.severity].color }} />
                   </div>
                   <div>
                     <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)" }}>{selectedThreat.title}</h3>
                     <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{selectedThreat.id} • {selectedThreat.repo}</p>
                   </div>
                 </div>
                <button onClick={() => setSelectedThreat(null)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", padding: "8px" }}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                   <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--color-border-subtle)" }}>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "800", color: "var(--color-text-muted)", marginBottom: "4px", textTransform: "uppercase" }}>Severity</label>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: severityConfig[selectedThreat.severity].color }}>{selectedThreat.severity}</span>
                   </div>
                   <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--color-border-subtle)" }}>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "800", color: "var(--color-text-muted)", marginBottom: "4px", textTransform: "uppercase" }}>Status</label>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: statusBadge[selectedThreat.status].color, textTransform: "capitalize" }}>{selectedThreat.status}</span>
                   </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                   <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "var(--color-text-secondary)", marginBottom: "10px" }}>
                     <Terminal size={14} /> Affected Context
                   </label>
                   <div style={{ padding: "16px", background: "#0F172A", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", fontFamily: "var(--font-mono)" }}>
                      <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "8px" }}>// file: {selectedThreat.file}</div>
                      <div style={{ fontSize: "13px", color: "#F8FAFC", display: "flex", gap: "10px" }}>
                        <span style={{ opacity: 0.3 }}>{selectedThreat.line}</span>
                        <span>{selectedThreat.desc}</span>
                      </div>
                   </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                   <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "var(--color-text-secondary)", marginBottom: "10px" }}>
                     <Zap size={14} style={{ color: "var(--color-accent)" }} /> AI Remediation Plan
                   </label>
                   <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                     Our security engine recommends sanitizing inputs using the `DOMPurify` library or implementing parameterized queries to prevent injection. 
                     Review the data binding at line {selectedThreat.line} for immediate resolution.
                   </p>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <button 
                      onClick={() => {
                        handleResolveThreat(selectedThreat.id);
                        setSelectedThreat(null);
                      }}
                      disabled={selectedThreat.status === "resolved"}
                      style={{ 
                        flex: 1, 
                        padding: "12px", 
                        background: selectedThreat.status === "resolved" ? "rgba(255,255,255,0.05)" : "rgba(34,197,94,0.1)", 
                        border: `1px solid ${selectedThreat.status === "resolved" ? "var(--color-border-subtle)" : "rgba(34,197,94,0.3)"}`, 
                        borderRadius: "10px", 
                        color: selectedThreat.status === "resolved" ? "var(--color-text-muted)" : "#22C55E", 
                        fontSize: "14px", 
                        fontWeight: "700", 
                        cursor: selectedThreat.status === "resolved" ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                    >
                      <ShieldCheck size={18} /> Resolve Now
                    </button>
                    <button
                      onClick={() => setSelectedThreat(null)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--color-border-subtle)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "var(--color-text-primary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                    >
                      Cancel
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

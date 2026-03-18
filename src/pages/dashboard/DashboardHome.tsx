import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import {
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Zap,
  Link2,
  Activity,
  Cpu,
  Database,
  Terminal as TerminalIcon,
  CheckCircle2,
  Download,
  Search,
} from "lucide-react";

const statsCards = [
  { label: "Secure Score", value: "87", unit: "/100", icon: ShieldCheck, color: "var(--color-success)", bg: "rgba(16,185,129,0.1)" },
  { label: "Active Threats", value: "5", unit: "", icon: AlertTriangle, color: "var(--color-danger)", bg: "rgba(239,68,68,0.1)" },
  { label: "Repositories", value: "12", unit: "", icon: GitBranch, color: "var(--color-accent)", bg: "rgba(34,211,238,0.1)" },
  { label: "Scans Today", value: "34", unit: "", icon: Zap, color: "#818CF8", bg: "rgba(129,140,248,0.1)" },
];

const initialScans = [
  { id: "S-502", repo: "api-gateway", branch: "main", status: "secure", score: 96, time: "2m ago", issues: 0 },
  { id: "S-501", repo: "auth-service", branch: "develop", status: "warning", score: 72, time: "18m ago", issues: 3 },
  { id: "S-500", repo: "payment-core", branch: "main", status: "scanning", score: null, time: "now", issues: null },
  { id: "S-499", repo: "user-service", branch: "feature/auth", status: "critical", score: 41, time: "1h ago", issues: 8 },
  { id: "S-498", repo: "notification-svc", branch: "main", status: "secure", score: 91, time: "2h ago", issues: 0 },
];

const infraMetrics = [
  { label: "GPU Usage", value: 34, unit: "%", color: "var(--color-accent)" },
  { label: "CPU Load", value: 58, unit: "%", color: "#818CF8" },
  { label: "Memory", value: 72, unit: "%", color: "var(--color-warning)" },
  { label: "Queue Depth", value: 12, unit: " jobs", color: "var(--color-success)" },
];

const SCAN_STEPS = [
  { id: 'cloning', label: 'Cloning Repository', icon: GitBranch },
  { id: 'static', label: 'Static Analysis', icon: Search },
  { id: 'deps', label: 'Dependency Mapping', icon: Database },
  { id: 'security', label: 'Security Context Audit', icon: ShieldCheck },
  { id: 'finalizing', label: 'Finalizing Report', icon: CheckCircle2 },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    secure: { label: "SECURE", color: "var(--color-success)" },
    warning: { label: "WARNING", color: "var(--color-warning)" },
    critical: { label: "CRITICAL", color: "var(--color-danger)" },
    scanning: { label: "SCANNING", color: "var(--color-accent)" },
  };
  const s = map[status] ?? { label: status.toUpperCase(), color: "var(--color-text-muted)" };
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: "700",
        color: s.color,
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${s.color}33`,
        padding: "2px 8px",
        borderRadius: "99px",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

const CHartData7D = [
  { day: "Mon", scans: 42 },
  { day: "Tue", scans: 65 },
  { day: "Wed", scans: 45 },
  { day: "Thu", scans: 87 },
  { day: "Fri", scans: 56 },
  { day: "Sat", scans: 92 },
  { day: "Sun", scans: 78 },
];

const CHartData30D = [
  { day: "W1", scans: 240 },
  { day: "W2", scans: 310 },
  { day: "W3", scans: 280 },
  { day: "W4", scans: 450 },
  { day: "W5", scans: 390 },
];

const CHartData90D = [
  { day: "Jan", scans: 1200 },
  { day: "Feb", scans: 1550 },
  { day: "Mar", scans: 1380 },
  { day: "Apr", scans: 1890 },
];

function ScanActivityChart() {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D">("7D");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const dataMap = {
    "7D": CHartData7D,
    "30D": CHartData30D,
    "90D": CHartData90D,
  };

  const currentData = dataMap[timeframe];
  const maxScans = Math.max(...currentData.map(d => d.scans));
  const height = 180;
  const width = 800; // Increased viewBox width for better resolution
  const paddingY = 30; // Vertical padding for health
  const paddingX = 0;  // No horizontal padding to allow edge-to-edge path

  const points = currentData.map((d, i) => {
    const x = (i / (currentData.length - 1)) * width;
    const y = height - ((d.scans / maxScans) * (height - paddingY * 2) + paddingY);
    return { x, y, val: d.scans, day: d.day };
  });
  // Smooth Bezier Curve Path Calculation
  const getCurvePath = () => {
    const p = points;
    let d = `M ${p[0].x} ${p[0].y}`;

    for (let i = 0; i < p.length - 1; i++) {
      const curr = p[i];
      const next = p[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const pathData = getCurvePath();
  const areaData = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="card-professional" style={{ padding: 0, overflow: "visible" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", background: "rgba(0,229,255,0.05)", borderRadius: "8px" }}>
            <Activity size={16} />
          </div>
          <div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)", display: "block" }}>Security Analytics</span>
            <span style={{ fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "600" }}>THREAT DETECTION TRENDS</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["7D", "30D", "90D"].map(t => (
            <button 
              key={t} 
              onClick={() => setTimeframe(t as any)}
              style={{ 
                padding: "4px 10px", 
                fontSize: "10px", 
                fontWeight: "700", 
                background: t === timeframe ? "rgba(0,229,255,0.1)" : "transparent",
                border: t === timeframe ? "1px solid var(--color-accent)" : "1px solid var(--color-border-subtle)",
                borderRadius: "4px",
                color: t === timeframe ? "var(--color-accent)" : "var(--color-text-muted)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { if(t !== timeframe) e.currentTarget.style.borderColor = "var(--color-accent)"; }}
              onMouseLeave={(e) => { if(t !== timeframe) e.currentTarget.style.borderColor = "var(--color-border-subtle)"; }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        style={{ padding: "30px 10px 40px 10px", position: "relative" }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
              <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line 
              key={i} 
              x1={0} 
              y1={height - (paddingY + p * (height - paddingY * 2))} 
              x2={width} 
              y2={height - (paddingY + p * (height - paddingY * 2))} 
              stroke="rgba(255,255,255,0.02)" 
              strokeWidth="1" 
            />
          ))}

          {/* Area */}
          <motion.path
            d={areaData}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Crosshair Line */}
          {hoverIndex !== null && (
            <motion.line
              x1={points[hoverIndex].x}
              y1={0}
              x2={points[hoverIndex].x}
              y2={height}
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            />
          )}

          {/* Main Curved Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: [0.43, 0.13, 0.23, 0.96] }}
          />

          {/* Interactive Hit Areas */}
          {points.map((p, i) => (
            <rect
              key={`hit-${i}`}
              x={p.x - 20}
              y={0}
              width={40}
              height={height}
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {/* Points */}
          {points.map((p, i) => (
            <g key={i} style={{ pointerEvents: "none" }}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={hoverIndex === i ? "6" : "4"}
                fill="var(--color-bg-primary)"
                stroke="var(--color-accent)"
                strokeWidth={hoverIndex === i ? "3" : "2"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                style={{ filter: hoverIndex === i ? "drop-shadow(0 0 8px var(--color-accent))" : "none" }}
              />
              <text 
                x={p.x} 
                y={height + 15} 
                fontSize="10" 
                fill={hoverIndex === i ? "var(--color-accent)" : "var(--color-text-muted)"} 
                textAnchor="middle" 
                fontWeight="700"
                style={{ transition: "color 0.2s ease" }}
              >
                {p.day}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip card */}
        <AnimatePresence>
          {hoverIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: "absolute",
                top: "20px",
                left: `${(points[hoverIndex].x / width) * 100}%`,
                transform: "translateX(-50%)",
                background: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--color-accent)",
                borderRadius: "12px",
                padding: "12px 16px",
                zIndex: 100,
                pointerEvents: "none",
                minWidth: "120px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,229,255,0.1)"
              }}
            >
              <div style={{ fontSize: "10px", color: "var(--color-accent)", fontWeight: "800", letterSpacing: "0.05em", marginBottom: "4px" }}>
                {currentData[hoverIndex].day.toUpperCase()} SCAN LOG
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--color-text-primary)" }}>
                  {currentData[hoverIndex].scans}
                </span>
                <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>Verifications</span>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ fontSize: "10px", color: "#22C55E", fontWeight: "700" }}>98.2% Accuracy</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "30px", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--color-border-subtle)" }}>
          <div style={{ display: "flex", gap: "24px" }}>
             <div>
                <div style={{ fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "700", marginBottom: "2px" }}>AVG {timeframe === '7D' ? 'WEEKLY' : timeframe === '30D' ? 'MONTHLY' : 'QUARTERLY'}</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--color-text-primary)" }}>
                  {(currentData.reduce((acc, curr) => acc + curr.scans, 0) / currentData.length).toFixed(1)}
                </div>
             </div>
             <div>
                <div style={{ fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "700", marginBottom: "2px" }}>PEAK VALUE</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--color-success)" }}>
                  {Math.max(...currentData.map(d => d.scans))}
                </div>
             </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
             <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", maxWidth: "150px", textAlign: "right", lineHeight: "1.4" }}>
              Current throughput is <span style={{ color: "var(--color-accent)", fontWeight: "700" }}>+12%</span> higher than last week.
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { showToast } = useToast();
  const [repoUrl, setRepoUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const [recentScans, setRecentScans] = useState(initialScans);
  const terminalRef = useRef<HTMLDivElement>(null);

  const [selectedPlatform, setSelectedPlatform] = useState("GitHub");

  const platformConfigs: Record<string, { description: string; placeholder: string }> = {
    GitHub: {
      description: "Enter the public GitHub repository URL you want to verify with our AI engine.",
      placeholder: "https://github.com/user/repository"
    },
    GitLab: {
      description: "Connect your GitLab projects for deep source code analysis and vulnerability mapping.",
      placeholder: "https://gitlab.com/user/project"
    },
    Bitbucket: {
      description: "Audit your Bitbucket repositories using our advanced AI-driven security scanners.",
      placeholder: "https://bitbucket.org/workspace/repo"
    },
    Azure: {
      description: "Integrate Azure DevOps repos to secure your enterprise cloud development pipeline.",
      placeholder: "https://dev.azure.com/org/project/_git/repo"
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const validateGithubLink = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+(\/)?$/;
    return regex.test(url);
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLogs(prev => [...prev.slice(-15), { msg, type }]);
  };

  const handleStartScan = async () => {
    if (!repoUrl.trim()) {
      showToast("Please enter a repository URL.", "error");
      return;
    }
    
    // For now keep the GitHub specific validation only for GitHub
    if (selectedPlatform === "GitHub" && !validateGithubLink(repoUrl)) {
      showToast("Invalid GitHub repository URL format. Use https://github.com/user/repo", "error");
      return;
    }

    setIsScanning(true);
    setLogs([]);
    setCurrentStep(0);
    showToast(`Initializing AI Verification Pipeline for ${selectedPlatform}...`, "info");

    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'unknown-repo';

    // Sequence simulation
    const steps = [
      { msg: `> Establishing secure tunnel to ${selectedPlatform.toLowerCase()}.com...`, delay: 800 },
      { msg: `> Cloning ${repoUrl}...`, type: 'info', delay: 1200 },
      { msg: `> Repository size: 142.4 MB. Data synchronized.`, type: 'success', delay: 500, step: 1 },
      { msg: `> Running AST parser on 248 discovered files...`, delay: 1000 },
      { msg: `> Parsing complete. No syntax errors detected.`, type: 'success', delay: 500, step: 2 },
      { msg: `> Mapping dependency graph for recursive audit...`, delay: 1200 },
      { msg: `> 18 vulnerabilities found in sub-dependencies.`, type: 'warn', delay: 500, step: 3 },
      { msg: `> AI Logic Analysis: Identifying sensitive data patterns...`, delay: 1500 },
      { msg: `> High confidence threat detected in /src/auth/handler.ts`, type: 'warn', delay: 800, step: 4 },
      { msg: `> Compiling final security scorecard...`, delay: 1000 },
      { msg: `> REPORT READY. SCORE: 84/100`, type: 'success', delay: 500, step: 5 },
    ];

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      await new Promise(r => setTimeout(r, s.delay));
      addLog(s.msg, s.type as any);
      if (s.step !== undefined) setCurrentStep(s.step);
    }

    setTimeout(() => {
      setIsScanning(false);
      const newScan = {
        id: `S-${recentScans.length + 500}`,
        repo: repoName,
        branch: "main",
        status: "secure",
        score: 84,
        time: "now",
        issues: 18
      };
      setRecentScans([newScan, ...recentScans]);
      showToast(`Verification complete for ${repoName}! Report added to history.`, "success");
      setRepoUrl("");
      setCurrentStep(-1);
    }, 1000);
  };

  const handleExport = () => {
    showToast("Processing dashboard data for Excel export...", "info");
    
    // Create a CSV mock
    const headers = "ID,Repository,Branch,Status,Score,Issues,Time\n";
    const rows = recentScans.map(s => `${s.id},${s.repo},${s.branch},${s.status},${s.score || 'N/A'},${s.issues || 0},${s.time}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TekverAI_Dashboard_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => showToast("Excel report generated successfully.", "success"), 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            Command Center
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Real-time AI verification & infrastructure command
          </p>
        </div>
        <button 
          onClick={handleExport}
          style={{
            padding: "10px 20px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "10px",
            color: "var(--color-text-primary)",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-dashboard)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border-subtle)")}
        >
          <Download size={15} />
          Export to Excel
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {statsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, borderColor: "var(--color-accent)" }}
              transition={{ delay: i * 0.05 }}
              className="card-professional"
              style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22} style={{ color: card.color }} />
              </div>
              <div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", lineHeight: "1" }}>
                  {card.value}<span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{card.unit}</span>
                </div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", marginTop: "4px", letterSpacing: "0.03em" }}>{card.label.toUpperCase()}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Input + Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Repository Input Refined */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-professional"
          style={{ padding: 0 }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", gap: "10px" }}>
            <Link2 size={16} style={{ color: "var(--color-accent)" }} />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>Connect & Analyze</span>
          </div>
          <div style={{ padding: "24px" }}>
             <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "16px", minHeight: "32px" }}>
                {platformConfigs[selectedPlatform].description}
             </p>
             <div style={{ position: "relative", marginBottom: "20px" }}>
                <Link2 size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input 
                  type="text"
                  placeholder={platformConfigs[selectedPlatform].placeholder}
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isScanning}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-mono)",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-accent)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--color-border-subtle)"}
                />
             </div>
             
             <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: isScanning ? "rgba(255,255,255,0.03)" : "var(--color-accent)",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "800",
                    color: isScanning ? "var(--color-text-muted)" : "var(--color-bg-primary)",
                    cursor: isScanning ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    fontFamily: "var(--font-dashboard)",
                    boxShadow: isScanning ? "none" : "0 8px 25px rgba(0,229,255,0.2)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isScanning) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.filter = "brightness(1.1)";
                      el.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isScanning) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.filter = "none";
                      el.style.transform = "none";
                    }
                  }}
                >
                  {isScanning ? <Zap size={18} className="animate-pulse" /> : <ShieldCheck size={18} />}
                  {isScanning ? "AI SCAN IN PROGRESS..." : `START AI VERIFICATION`}
                </button>
             </div>

             <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed var(--color-border-subtle)" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", marginBottom: "12px", letterSpacing: "0.05em" }}>POPULAR PLATFORMS</div>
                <div style={{ display: "flex", gap: "8px" }}>
                   {["GitHub", "GitLab", "Bitbucket", "Azure"].map(p => (
                     <button 
                       key={p} 
                       onClick={() => setSelectedPlatform(p)}
                       disabled={isScanning}
                       style={{ 
                         flex: 1, 
                         padding: "8px", 
                         background: selectedPlatform === p ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.02)", 
                         border: "1px solid", 
                         borderColor: selectedPlatform === p ? "var(--color-accent)" : "var(--color-border-subtle)",
                         borderRadius: "8px", 
                         fontSize: "11px", 
                         color: selectedPlatform === p ? "var(--color-accent)" : "var(--color-text-secondary)", 
                         cursor: isScanning ? "not-allowed" : "pointer",
                         fontWeight: selectedPlatform === p ? "700" : "400",
                         transition: "all 0.2s ease"
                       }}
                     >
                        {p}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>

        {/* AI Process Visualization Enhanced */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-professional"
          style={{ padding: 0, display: "flex", flexDirection: "column" }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <TerminalIcon size={16} style={{ color: "var(--color-accent)" }} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>AI Analysis Engine</span>
            </div>
            {isScanning && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                 <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-accent)", animation: "pulse 1.5s infinite" }} />
                 <span style={{ fontSize: "11px", color: "var(--color-accent)", fontWeight: "700" }}>LIVE</span>
              </div>
            )}
          </div>

          <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Steps Visual */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", position: "relative" }}>
               <div style={{ position: "absolute", top: "25px", left: "20px", right: "20px", height: "2px", background: "rgba(255,255,255,0.01)", zIndex: 0 }} />
               {SCAN_STEPS.map((step, i) => {
                 const StepIcon = step.icon;
                 const isActive = i === currentStep;
                 const isCompleted = i < currentStep;
                 return (
                   <div key={step.id} style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "60px" }}>
                      <div 
                        style={{ 
                          width: "32px", 
                          height: "32px", 
                          borderRadius: "10px", 
                          background: isCompleted ? "var(--color-success)" : isActive ? "var(--color-accent)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isCompleted ? "#22C55E" : isActive ? "var(--color-accent)" : "transparent"}`,
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          color: isCompleted ? "#fff" : isActive ? "var(--color-bg-primary)" : "var(--color-text-muted)",
                          transition: "all 0.3s ease",
                          boxShadow: isActive ? "0 0 15px rgba(0,229,255,0.4)" : "none"
                        }}
                      >
                         <StepIcon size={16} />
                      </div>
                      <span style={{ fontSize: "8px", fontWeight: "700", color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)", textAlign: "center", textTransform: "uppercase" }}>{step.label.split(' ')[0]}</span>
                   </div>
                 );
               })}
            </div>

            {/* Terminal Log */}
            <div 
              ref={terminalRef}
              className="custom-scrollbar"
              style={{ 
                flex: 1, 
                background: "#020617", 
                borderRadius: "12px", 
                padding: "16px", 
                fontFamily: "var(--font-mono)", 
                fontSize: "12px", 
                border: "1px solid var(--color-border-subtle)",
                overflowY: "auto",
                minHeight: "180px",
                maxHeight: "220px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
               {logs.length === 0 && !isScanning && (
                 <div style={{ color: "rgba(255,255,255,0.1)", textAlign: "center", marginTop: "60px" }}>
                    Waiting for core verification initiation...
                 </div>
               )}
               {logs.map((log, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, x: -5 }} 
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.2 }}
                   style={{ 
                     color: log.type === 'success' ? "#22C55E" : log.type === 'warn' ? "#F59E0B" : "rgba(255,255,255,0.6)",
                     paddingLeft: "4px"
                   }}
                 >
                   {log.msg}
                 </motion.div>
               ))}
               {isScanning && (
                 <motion.div 
                   animate={{ opacity: [1, 0, 1] }} 
                   transition={{ duration: 1, repeat: Infinity }}
                   style={{ color: "var(--color-accent)", fontWeight: "bold" }}
                 >
                    _
                 </motion.div>
               )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Widget C — Analytics Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ScanActivityChart />
      </motion.div>

      {/* Widget D — Sync List + Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-5">
        
        {/* Recent Verifications (Synced State) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-professional"
          style={{ padding: 0 }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.01)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <GitBranch size={16} style={{ color: "var(--color-accent)" }} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>Recent Verification Log</span>
            </div>
            <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontWeight: "600" }}>COUNT: {recentScans.length}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--color-border-subtle)" }}>
                  {["ID", "Repository", "Branch", "Status", "Score", "Time"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: "800", color: "var(--color-text-muted)", letterSpacing: "0.1em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {recentScans.map((scan, i) => (
                    <motion.tr
                      key={scan.id}
                      initial={{ opacity: 0, background: "rgba(34,211,238,0.1)" }}
                      animate={{ opacity: 1, background: "transparent" }}
                      exit={{ opacity: 0 }}
                      style={{ borderBottom: i < recentScans.length - 1 ? "1px solid var(--color-border-subtle)" : "none", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>#{scan.id}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "14px", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", fontWeight: "700" }}>{scan.repo}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>{scan.branch}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={scan.status} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {scan.score !== null ? (
                          <span style={{ fontSize: "14px", fontWeight: "800", color: scan.score >= 80 ? "var(--color-success)" : scan.score >= 60 ? "var(--color-warning)" : "var(--color-danger)", fontFamily: "var(--font-mono)" }}>
                            {scan.score}
                          </span>
                        ) : (
                          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: "20px", height: "4px", background: "var(--color-accent)", borderRadius: "2px" }} />
                        )}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontWeight: "500" }}>{scan.time}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Infra Metrics Widget */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-professional"
          style={{ padding: 0 }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", gap: "10px" }}>
            <Activity size={16} style={{ color: "var(--color-accent)" }} />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>Sys Health</span>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
            {infraMetrics.map(({ label, value, unit, color }, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontWeight: "600" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: "800", color, fontFamily: "var(--font-mono)" }}>{value}{unit}</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.03)", borderRadius: "3px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 1, ease: "easeOut" }}
                    style={{ height: "100%", background: color, borderRadius: "3px" }}
                  />
                </div>
              </div>
            ))}
            
            <div style={{ marginTop: "10px", padding: "12px", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.1)", borderRadius: "10px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--color-accent)", fontWeight: "700" }}>
                  <Cpu size={12} />
                  GPU ACCELERATED
               </div>
               <div style={{ fontSize: "10px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  Active node: us-east-4 (NVIDIA A100)
               </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        @keyframes scan-glow {
          0% { box-shadow: 0 0 5px rgba(0,229,255,0.2); }
          50% { box-shadow: 0 0 15px rgba(0,229,255,0.4); }
          100% { box-shadow: 0 0 5px rgba(0,229,255,0.2); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { Activity, Server, Cpu, Database, Cloud, AlertCircle, Clock, RefreshCw, Radio, X, ShieldAlert, Send } from "lucide-react";

const initialServices = [
  { id: 1, name: "AI Verification Engine", status: "operational", uptime: "99.98%", latency: "1.8s", icon: Cpu, color: "#22C55E" },
  { id: 2, name: "Code Analysis API", status: "operational", uptime: "99.95%", latency: "120ms", icon: Server, color: "#22C55E" },
  { id: 3, name: "Security Scanner", status: "operational", uptime: "100%", latency: "85ms", icon: Activity, color: "#22C55E" },
  { id: 4, name: "Repository Connector", status: "degraded", uptime: "98.2%", latency: "340ms", icon: Cloud, color: "#F59E0B" },
  { id: 5, name: "Report Generator", status: "operational", uptime: "99.91%", latency: "210ms", icon: Database, color: "#22C55E" },
];

const incidents = [
  { date: "Mar 10, 2026 14:30", title: "Repository Connector Latency Spike", status: "monitoring", desc: "Elevated response times detected in GitHub integration layer. Engineering team investigating." },
  { date: "Mar 09, 2026 08:15", title: "Scheduled Maintenance Complete", status: "resolved", desc: "AI Engine updated to v2.4.1. GPU cluster expanded by 40% capacity." },
];

const gpuMetrics = [
  { label: "GPU Cluster A — A100", value: 34, total: "8x A100", temp: "64°C" },
  { label: "GPU Cluster B — H100", value: 21, total: "4x H100", temp: "58°C" },
];

export default function SystemStatus() {
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [services, setServices] = useState(initialServices);
  const [gpuLoad, setGpuLoad] = useState(gpuMetrics);

  // Dynamic fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRefreshing) return;
      setGpuLoad(prev => prev.map(gpu => ({
        ...gpu,
        value: Math.max(5, Math.min(98, gpu.value + (Math.random() > 0.5 ? 1 : -1)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, [isRefreshing]);

  const getProgressColor = (value: number) => {
    if (value > 85) return "linear-gradient(90deg, #EF4444, #F87171)";
    if (value > 65) return "linear-gradient(90deg, #F59E0B, #FB923C)";
    return "linear-gradient(90deg, #00E5FF, #2979FF)";
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    const originalLoad = [...gpuLoad];
    
    // Set to 0 for "climb" effect
    setGpuLoad(prev => prev.map(gpu => ({ ...gpu, value: 0 })));
    
    showToast("Polling global infrastructure status handlers...", "info");
    
    setTimeout(() => {
      setIsRefreshing(false);
      setGpuLoad(originalLoad);
      showToast("Infrastructure status synchronized.", "success");
    }, 2000);
  };

  const handleReportIncident = () => {
    setIsIncidentModalOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            System Status
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Real-time infrastructure monitoring and health metrics
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
           <button 
             onClick={handleRefresh}
             disabled={isRefreshing}
             style={{
               padding: "9px 16px",
               background: "var(--color-surface)",
               border: "1px solid var(--color-border-subtle)",
               borderRadius: "8px",
               color: "var(--color-text-secondary)",
               fontSize: "13px",
               cursor: isRefreshing ? "not-allowed" : "pointer",
               display: "flex",
               alignItems: "center",
               gap: "8px",
               fontFamily: "var(--font-dashboard)",
               transition: "all 0.2s ease"
             }}
           >
             <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
             {isRefreshing ? "Refreshing..." : "Refresh Status"}
           </button>
           <button 
             onClick={handleReportIncident}
             style={{
               padding: "9px 16px",
               background: "rgba(239,68,68,0.1)",
               border: "1px solid rgba(239,68,68,0.2)",
               borderRadius: "8px",
               color: "#EF4444",
               fontSize: "13px",
               fontWeight: "600",
               cursor: "pointer",
               fontFamily: "var(--font-dashboard)",
               transition: "all 0.2s ease"
             }}
             onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
             onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
           >
             Report Incident
           </button>
        </div>
      </div>

      {/* Overall status banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "20px 24px",
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", right: "-10px", top: "-10px", opacity: 0.05 }}>
           <AlertCircle size={100} color="#F59E0B" />
        </div>
        <AlertCircle size={20} style={{ color: "#F59E0B", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "3px" }}>
            Partial System Degradation
          </div>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Repository Connector is experiencing elevated latency in the US-EAST region. All other systems operational.
          </div>
        </div>
      </motion.div>

      {/* GPU Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Radio size={16} style={{ color: "#00E5FF" }} className="animate-pulse" />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)" }}>
              GPU Infrastructure Load
            </span>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#76b900",
              background: "rgba(118,185,0,0.08)",
              border: "1px solid rgba(118,185,0,0.2)",
              padding: "2px 8px",
              borderRadius: "99px",
            }}
          >
            NVIDIA SDK 12.4
          </span>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {gpuLoad.map((gpu, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>{gpu.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>{gpu.total} • Temp: {gpu.temp}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                   <span style={{ fontSize: "22px", fontWeight: "800", color: gpu.value > 85 ? "#EF4444" : gpu.value > 65 ? "#F59E0B" : "var(--color-accent)", fontFamily: "var(--font-mono)", transition: "color 0.3s ease" }}>
                     {gpu.value}%
                   </span>
                   <div style={{ fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "600" }}>UTILIZATION</div>
                </div>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "5px", overflow: "hidden", border: "1px solid var(--color-border-subtle)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gpu.value}%` }}
                  transition={{ duration: isRefreshing ? 2 : 0.8, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: getProgressColor(gpu.value),
                    borderRadius: "5px",
                    boxShadow: gpu.value > 85 ? "0 0 15px rgba(239,68,68,0.3)" : "0 0 15px rgba(0,229,255,0.2)",
                    transition: "background 0.5s ease"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Services */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.01)" }}>
          <Server size={16} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>Active Services Status</span>
        </div>
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              style={{
                padding: "16px 20px",
                borderBottom: i < services.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${svc.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} style={{ color: svc.color }} className={svc.status === 'operational' ? '' : 'animate-pulse'} />
              </div>
              <div style={{ flex: 1, minWidth: "150px" }}>
                 <div style={{ fontSize: "14px", color: "var(--color-text-primary)", fontWeight: "600" }}>
                   {svc.name}
                 </div>
                 <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                   Uptime: {svc.uptime} • Health: {svc.status === 'operational' ? 'Stable' : 'Unstable'}
                 </div>
              </div>
              <div style={{ textAlign: "right", marginRight: "12px" }}>
                 <div style={{ fontSize: "12px", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                   {svc.latency}
                 </div>
                 <div style={{ fontSize: "10px", color: "var(--color-text-muted)", fontWeight: "600" }}>LATENCY</div>
              </div>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: "800",
                  color: svc.color,
                  background: `${svc.color}10`,
                  border: `1px solid ${svc.color}30`,
                  padding: "4px 12px",
                  borderRadius: "99px",
                  letterSpacing: "0.06em",
                  minWidth: "100px",
                  textAlign: "center"
                }}
              >
                {svc.status.toUpperCase()}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Incidents */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.01)" }}>
          <Clock size={16} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>Recent Incident Log</span>
        </div>
        {incidents.map((inc, i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              borderBottom: i < incidents.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--color-text-primary)" }}>
                {inc.title}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  color: inc.status === "resolved" ? "#22C55E" : "#F59E0B",
                  background: inc.status === "resolved" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                  border: `1px solid ${inc.status === "resolved" ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                  padding: "2px 10px",
                  borderRadius: "99px",
                  letterSpacing: "0.02em"
                }}
              >
                {inc.status.toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
              {inc.desc}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-text-muted)" }}>
               <Clock size={11} />
               <span style={{ fontSize: "11px", fontWeight: "500" }}>{inc.date}</span>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {isIncidentModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsIncidentModalOpen(false)}
               style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(6px)" }}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               style={{
                 width: "100%",
                 maxWidth: "550px",
                 background: "var(--color-surface)",
                 border: "1px solid var(--color-border-subtle)",
                 borderRadius: "24px",
                 position: "relative",
                 padding: "32px",
                 boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
               }}
             >
                <div className="flex justify-between items-start gap-4 mb-6">
                   <div className="flex gap-3 items-center flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.1)] flex items-center justify-center text-[#EF4444] shrink-0">
                         <ShieldAlert size={20} />
                      </div>
                      <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] leading-tight flex-1">Report Infrastructure Incident</h3>
                   </div>
                   <button onClick={() => setIsIncidentModalOpen(false)} className="bg-transparent border-none text-[var(--color-text-muted)] cursor-pointer shrink-0 mt-1">
                      <X size={20} />
                   </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                   <div>
                      <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-2">Affected Service</label>
                      <select className="w-full p-3 bg-[rgba(255,255,255,0.03)] border border-[var(--color-border-subtle)] rounded-lg text-[var(--color-text-primary)] outline-none appearance-none">
                         <option className="bg-[#0f172a] text-white">AI Verification Engine</option>
                         <option className="bg-[#0f172a] text-white">Code Analysis API</option>
                         <option className="bg-[#0f172a] text-white">Security Scanner</option>
                         <option className="bg-[#0f172a] text-white">Repository Connector</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[13px] font-semibold text-[var(--color-text-secondary)] mb-2">Severity Level</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                         {["Low", "Medium", "High", "Critical"].map(level => (
                            <button key={level} className="p-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--color-border-subtle)] rounded-lg text-[12px] text-[var(--color-text-secondary)] cursor-pointer">{level}</button>
                         ))}
                      </div>
                   </div>
                   <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--color-text-secondary)", marginBottom: "8px" }}>Describe the Issue</label>
                      <textarea 
                        rows={4}
                        placeholder="Provide details about the degradation or outage..."
                        style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border-subtle)", borderRadius: "10px", color: "var(--color-text-primary)", outline: "none", resize: "none", fontSize: "14px" }}
                      />
                   </div>
                   
                   <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <button onClick={() => setIsIncidentModalOpen(false)} className="flex-1 p-[14px] bg-[rgba(255,255,255,0.03)] border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-text-primary)] font-semibold cursor-pointer">Cancel</button>
                      <button 
                        onClick={() => {
                          showToast("Submitting incident report to engineering team...", "info");
                          setTimeout(() => {
                            showToast("Incident report submitted. Tracking ID: INC-8821", "success");
                            setIsIncidentModalOpen(false);
                          }, 1500);
                        }}
                        className="flex-1 p-[14px] bg-[#EF4444] border-none rounded-xl text-white font-bold cursor-pointer flex items-center justify-center gap-2"
                      >
                         <Send size={16} /> Submit Report
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

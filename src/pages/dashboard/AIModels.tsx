import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Bot, Zap, Shield, Cpu, Activity } from "lucide-react";

interface AIModel {
  name: string;
  type: string;
  status: string;
  load: string;
  health: number;
}

const initialModels: AIModel[] = [
  { name: "Tekver Core-V2", type: "Neural Scanner", status: "Optimal", load: "24%", health: 98 },
  { name: "SentiGuard Pro", type: "Sentiment Sentinel", status: "Active", load: "41%", health: 100 },
  { name: "VulnSense AI", type: "Vulnerability Detector", status: "Standby", load: "0%", health: 95 },
];

export default function AIModels() {
  const { showToast } = useToast();
  const [models, setModels] = useState<AIModel[]>(initialModels);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    showToast("Initializing fleet-wide neural optimization...", "info");

    // Simulation steps
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Recovery Phase
    setModels(prev => prev.map(m => ({
      ...m,
      health: Math.min(100, m.health + Math.floor(Math.random() * 5) + 2),
      status: m.status === "Standby" ? "Standby" : "Optimizing"
    })));
    showToast("Re-calibrating agent sensitivity levels...", "info");

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Distribution Phase
    setModels(prev => prev.map(m => ({
      ...m,
      health: 100,
      load: m.status === "Standby" ? "0%" : `${Math.floor(Math.random() * 15) + 15}%`,
      status: "Optimal"
    })));

    setIsOptimizing(false);
    showToast("AI Fleet optimization complete. Resources balanced.", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5 sm:gap-4 mb-2">
        <div className="text-center sm:text-left">
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] mb-1">
            AI Engine Fleet
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-snug">
            Monitor and configure specialized AI agents powering your security posture
          </p>
        </div>
        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full sm:w-auto justify-center"
          style={{
            padding: "12px 20px",
            background: isOptimizing ? "rgba(0,229,255,0.05)" : "rgba(0,229,255,0.1)",
            border: "1px solid var(--color-accent)",
            borderRadius: "10px",
            color: isOptimizing ? "var(--color-text-muted)" : "var(--color-accent)",
            fontSize: "13px",
            fontWeight: "700",
            cursor: isOptimizing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            opacity: isOptimizing ? 0.7 : 1
          }}
        >
          {isOptimizing ? (
            <div style={{ width: "14px", height: "14px", border: "2px solid var(--color-accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          ) : <Zap size={14} />}
          {isOptimizing ? "Optimizing..." : "Optimize Fleet"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {models.map((model, i) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: "24px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(0,229,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={20} style={{ color: "var(--color-accent)" }} />
              </div>
              <div style={{ 
                padding: "4px 10px", 
                borderRadius: "20px", 
                background: model.status === "Optimal" ? "rgba(34,197,94,0.1)" : "rgba(0,229,255,0.1)",
                color: model.status === "Optimal" ? "#22C55E" : "var(--color-accent)",
                fontSize: "11px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.3s ease"
              }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }} />
                {model.status}
              </div>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
              {model.name}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
              {model.type}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Operational Health</span>
                <span style={{ color: "var(--color-success)", fontWeight: "600" }}>{model.health}%</span>
              </div>
              <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${model.health}%` }}
                  style={{ height: "100%", background: "var(--color-success)", borderRadius: "2px" }} 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                <div style={{ padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid var(--color-border-subtle)" }}>
                  <div style={{ fontSize: "10px", color: "var(--color-text-muted)", marginBottom: "4px" }}>REAL-TIME LOAD</div>
                  <motion.div 
                    key={model.load}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}
                  >
                    {model.load}
                  </motion.div>
                </div>
                <div style={{ padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid var(--color-border-subtle)" }}>
                  <div style={{ fontSize: "10px", color: "var(--color-text-muted)", marginBottom: "4px" }}>LATENCY</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>12ms</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: "28px", background: "linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(0,229,255,0.05) 100%)", borderRadius: "16px", border: "1px solid rgba(0,229,255,0.1)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Activity size={18} style={{ color: "var(--color-accent)" }} />
          Fleet Intelligence Status
        </h3>
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
          Your AI fleet is currently operating within optimal parameters. Distributed sensitivity is set to <span style={{ color: "var(--color-accent)", fontWeight: "600" }}>Balanced (6.0)</span>. 
          The next scheduled model retraining is in 4 days.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

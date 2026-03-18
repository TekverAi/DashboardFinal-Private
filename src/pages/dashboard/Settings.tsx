import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { User, Key, Bell, Shield, Save, Eye, EyeOff, Copy, Smartphone } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function Settings() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  
  // Sync tab state with URL params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle manual tab switch
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };
  const [isSaving, setIsSaving] = useState(false);
  const [revealKey, setRevealKey] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, label: "Critical vulnerability detected", desc: "Immediate alert for critical severity findings", enabled: true },
    { id: 2, label: "Verification complete", desc: "Notify when a scan finishes", enabled: true },
    { id: 3, label: "Weekly security digest", desc: "Summary of security posture changes", enabled: false },
    { id: 4, label: "System status updates", desc: "Infrastructure incidents and maintenance", enabled: true },
  ]);

  const handleSave = () => {
    setIsSaving(true);
    showToast("Saving your preference updates...", "info");
    setTimeout(() => {
      setIsSaving(false);
      showToast("Settings updated successfully.", "success");
    }, 2000);
  };

  const toggleNotification = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
    const item = notifications.find(n => n.id === id);
    showToast(`${item?.label} ${!item?.enabled ? 'enabled' : 'disabled'}`, "info");
  };

  const handleCopyKey = () => {
    showToast("API Key copied to clipboard.", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            Settings
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Manage your account and platform preferences
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Horizontal tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "14px",
            padding: "6px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === id ? "rgba(0,229,255,0.08)" : "transparent",
                color: activeTab === id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                fontSize: "13px",
                fontWeight: activeTab === id ? "700" : "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-dashboard)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                borderBottom: activeTab === id ? "2px solid var(--color-accent)" : "2px solid transparent",
              }}
            >
              <Icon size={16} style={{ color: activeTab === id ? "var(--color-accent)" : "var(--color-text-muted)" }} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            flex: 1,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "14px",
            overflow: "hidden",
            minWidth: "300px",
            position: "relative"
          }}
        >
          {activeTab === "profile" && (
            <div style={{ padding: "28px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "24px" }}>
                Profile Settings
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {[
                  { label: "Full Name", value: user?.displayName || "", placeholder: "John Developer", type: "text" },
                  { label: "Email Address", value: user?.email || "", placeholder: "john@company.com", type: "email", disabled: true },
                  { label: "Organization", value: "", placeholder: "Acme Corp", type: "text" },
                  { label: "Job Title", value: "", placeholder: "Senior Engineer", type: "text" },
                ].map(({ label, value, placeholder, type, disabled }) => (
                  <div key={label}>
                    <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--color-text-secondary)", display: "block", marginBottom: "8px" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      defaultValue={value}
                      placeholder={placeholder}
                      disabled={disabled}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: disabled ? "rgba(255,255,255,0.02)" : "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-subtle)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: disabled ? "var(--color-text-muted)" : "var(--color-text-primary)",
                        outline: "none",
                        fontFamily: "var(--font-dashboard)",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s ease",
                        cursor: disabled ? "not-allowed" : "text"
                      }}
                      onFocus={(e) => !disabled && ((e.target as HTMLElement).style.borderColor = "var(--color-accent)")}
                      onBlur={(e) => !disabled && ((e.target as HTMLElement).style.borderColor = "var(--color-border-subtle)")}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div style={{ padding: "28px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "24px" }}>
                API Keys
              </h2>
              <div
                style={{
                  padding: "20px",
                  background: "var(--color-bg-secondary)",
                  borderRadius: "12px",
                  border: "1px solid var(--color-border-subtle)",
                  marginBottom: "20px",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                   <div className="text-[12px] text-[var(--color-text-muted)] font-semibold">Live Production Key</div>
                   <div className="text-[10px] text-[var(--color-success)] font-bold bg-[#22C55E]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">ACTIVE</div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 text-[13px] text-[var(--color-accent)] font-mono p-3.5 bg-[rgba(0,229,255,0.05)] rounded-xl break-all border border-[rgba(0,229,255,0.1)] flex justify-between items-center gap-3">
                    <span className="truncate">{revealKey ? "tkv_live_8F2n9K4m2P0x1Q7z5W3v9G1r4T6y8U0j" : "tkv_live_••••••••••••••••••••••••••••••••"}</span>
                    <button 
                      onClick={handleCopyKey}
                      className="bg-transparent border-none text-[var(--color-text-muted)] cursor-pointer flex shrink-0 hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => setRevealKey(!revealKey)}
                    className="p-3.5 bg-[rgba(255,255,255,0.05)] border border-[var(--color-border-subtle)] rounded-xl text-[13px] text-[var(--color-text-primary)] cursor-pointer font-dashboard flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.08)] transition-all sm:w-auto"
                  >
                    {revealKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    {revealKey ? "Hide" : "Reveal"}
                  </button>
                </div>
              </div>
              <div
                className="p-4 bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-xl text-[13px] text-[var(--color-text-secondary)] leading-relaxed"
              >
                Keep your API key secure. Do not expose it in client-side code or version control. Use environment variables for production.
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={{ padding: "28px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "24px" }}>
                Notification Preferences
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {notifications.map(({ id, label, desc, enabled }) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      background: "rgba(255,255,255,0.01)",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border-subtle)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "3px" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{desc}</div>
                    </div>
                    <div
                      onClick={() => toggleNotification(id)}
                      style={{
                        width: "44px",
                        height: "24px",
                        borderRadius: "12px",
                        background: enabled ? "var(--color-accent)" : "rgba(255,255,255,0.1)",
                        cursor: "pointer",
                        position: "relative",
                        flexShrink: 0,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: enabled ? "0 0 10px rgba(0,229,255,0.3)" : "none"
                      }}
                    >
                      <motion.div
                        animate={{ x: enabled ? 22 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{
                          position: "absolute",
                          top: "4px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: "#fff",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div style={{ padding: "28px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "24px" }}>
                Security Configuration
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--color-text-secondary)", display: "block", marginBottom: "8px" }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "var(--color-bg-secondary)",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "var(--color-text-primary)",
                      outline: "none",
                      fontFamily: "var(--font-dashboard)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--color-text-secondary)", display: "block", marginBottom: "8px" }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-subtle)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "var(--color-text-primary)",
                        outline: "none",
                        fontFamily: "var(--font-dashboard)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--color-text-secondary)", display: "block", marginBottom: "8px" }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-subtle)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "var(--color-text-primary)",
                        outline: "none",
                        fontFamily: "var(--font-dashboard)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save button footer */}
          {(activeTab === "profile" || activeTab === "security") && (
            <div
              style={{
                padding: "20px 28px",
                background: "rgba(255,255,255,0.01)",
                borderTop: "1px solid var(--color-border-subtle)",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: "10px 24px",
                  background: isSaving ? "rgba(255,255,255,0.1)" : (activeTab === "security" ? "linear-gradient(135deg, #EF4444, #991B1B)" : "var(--color-accent)"),
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#fff",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-dashboard)",
                  transition: "all 0.3s ease",
                  opacity: isSaving ? 0.7 : 1,
                  boxShadow: !isSaving ? "0 4px 15px rgba(0,229,255,0.1)" : "none"
                }}
              >
                {isSaving ? (
                  <div style={{ width: "14px", height: "14px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                ) : <Save size={16} />}
                {isSaving ? "Saving..." : activeTab === "security" ? "Update Password" : "Save Changes"}
              </button>
            </div>
          )}
        </motion.div>
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

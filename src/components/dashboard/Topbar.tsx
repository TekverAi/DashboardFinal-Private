/* DASHBOARD COMPONENT */
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  LogOut, 
  Settings as SettingsIcon, 
  Inbox
} from "lucide-react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfile(false);
    showToast("Signing out...", "info");
    try {
      await logout();
      showToast("Signed out successfully.", "success");
      navigate("/login");
    } catch (error: any) {
      showToast("Failed to sign out.", "error");
    }
  };

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/dashboard/settings");
  };

  // Breadcrumb logic
  const pathSegments = pathname.split("/").filter(p => p);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { name, url, isLast: index === pathSegments.length - 1 };
  });

  // Initials logic
  const getInitials = () => {
    if (!user) return "U";
    const name = user.displayName || "";
    const parts = name.split(" ").filter(p => p);
    if (parts.length >= 2) {
      return `${parts[0][0]}.${parts[1][0]}`.toUpperCase();
    }
    return (name.charAt(0) || user.email?.charAt(0) || "U").toUpperCase();
  };

  return (
    <header
      style={{
        height: "64px",
        background: "var(--color-bg-secondary)",
        borderBottom: "1px solid var(--color-border-subtle)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden"
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-secondary)",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "8px",
        }}
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumbs (Alternative to Search) */}
      <nav 
        className="flex items-center gap-2 flex-1 min-w-0"
      >
        {breadcrumbs.map((bc, i) => (
          <div key={bc.url} className="flex items-center gap-2 min-w-0 shrink">
            {i > 0 && <span className="shrink-0" style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>/</span>}
            <Link
              to={bc.url}
              className="truncate"
              style={{
                fontSize: "13px",
                fontWeight: bc.isLast ? "700" : "500",
                color: bc.isLast ? "var(--color-text-primary)" : "var(--color-text-muted)",
                textDecoration: "none",
                pointerEvents: bc.isLast ? "none" : "auto",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => !bc.isLast && (e.currentTarget.style.color = "var(--color-accent)")}
              onMouseLeave={(e) => !bc.isLast && (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              {bc.name}
            </Link>
          </div>
        ))}
      </nav>

      <div className="hidden md:flex" style={{ flex: 1 }} />

      <div className="flex items-center gap-3 shrink-0">
        {/* Scan status indicator */}
        <div
          className="hidden lg:flex items-center gap-2"
          style={{
          padding: "6px 12px",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--color-success)",
            animation: "pulse 2s infinite",
          }}
        />
        <span style={{ fontSize: "12px", color: "var(--color-success)", fontWeight: "700" }}>
          Systems Online
        </span>
      </div>

      {/* Notifications */}
      <div style={{ position: "relative" }} ref={notificationRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: showNotifications ? "var(--color-accent)" : "var(--color-text-secondary)",
            transition: "all 0.2s ease",
            borderColor: showNotifications ? "var(--color-accent)" : "var(--color-border-subtle)"
          }}
        >
          <Bell size={16} />
          <div
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--color-danger)",
              border: "2px solid var(--color-bg-secondary)",
            }}
          />
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute -right-14 sm:right-0 w-[290px] sm:w-[320px]"
              style={{
                top: "calc(100% + 12px)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                padding: "24px",
                zIndex: 100
              }}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                 <div 
                   className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-inner"
                   style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.1)" }}
                 >
                    <Inbox size={26} style={{ color: "var(--color-accent)" }} />
                    <div 
                      className="absolute top-1 right-1 w-3 h-3 rounded-full animate-pulse" 
                      style={{ background: "var(--color-accent)", boxShadow: "0 0 8px var(--color-accent)" }}
                    />
                 </div>
                 <div>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: "var(--color-text-primary)", marginBottom: "6px", letterSpacing: "0.02em" }}>
                      System Secure
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.5", padding: "0 8px" }}>
                      No new security alerts. We'll notify you if any anomalies are detected.
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile */}
      <div style={{ position: "relative" }} ref={profileRef}>
        <div
          onClick={() => setShowProfile(!showProfile)}
          title={user?.email || "User Profile"}
          className="flex items-center gap-[10px]"
          style={{
            padding: "6px 12px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            borderColor: showProfile ? "var(--color-accent)" : "var(--color-border-subtle)"
          }}
          onMouseEnter={(e) => {
            if (!showProfile) e.currentTarget.style.borderColor = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            if (!showProfile) e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          }}
        >
          {user?.photoURL && !imgError ? (
            <img 
              src={user.photoURL} 
              alt="Avatar" 
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} 
            />
          ) : (
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00E5FF, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "800",
                color: "#fff",
              }}
            >
              {getInitials()}
            </div>
          )}
          <span
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--color-text-primary)",
            }}
            className="hidden md:block"
          >
            {user?.displayName || (user?.email?.split('@')[0]) || "User"}
          </span>
          <ChevronDown 
            size={14} 
            style={{ 
              color: "var(--color-text-muted)", 
              transition: "transform 0.2s ease",
              transform: showProfile ? "rotate(180deg)" : "rotate(0)"
            }} 
            className="hidden md:block" 
          />
        </div>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                width: "200px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "14px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                overflow: "hidden",
                zIndex: 100
              }}
            >
              <div style={{ padding: "16px", borderBottom: "1px solid var(--color-border-subtle)" }}>
                 <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--color-text-primary)" }}>{user?.displayName || "User"}</div>
                 <div style={{ fontSize: "11px", color: "var(--color-text-muted)", wordBreak: "break-all" }}>{user?.email}</div>
              </div>
              <div style={{ padding: "6px" }}>
                <button
                  onClick={handleSettings}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    color: "var(--color-text-primary)",
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <SettingsIcon size={14} style={{ color: "var(--color-text-muted)" }} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    color: "#EF4444",
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </header>
  );
}

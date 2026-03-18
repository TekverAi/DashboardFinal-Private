/* DASHBOARD COMPONENT */
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GitBranch,
  ShieldCheck,
  FileText,
  Activity,
  Settings,
  ChevronRight,
  LogOut,
  X,
  Cpu,
  Bot,
  Link as LinkIcon
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Repositories", href: "/dashboard/repositories", icon: GitBranch },
  { label: "Verifications", href: "/dashboard/verifications", icon: ShieldCheck },
  { label: "Security", href: "/dashboard/security", icon: FileText },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "System Status", href: "/dashboard/system-status", icon: Activity },
  { label: "AI Fleet", href: "/dashboard/ai-fleet", icon: Bot },
  { 
    label: "Settings", 
    href: "/dashboard/settings", 
    icon: Settings,
    children: [
      { label: "Profile", href: "/dashboard/settings?tab=profile" },
      { label: "API Keys", href: "/dashboard/settings?tab=api" },
      { label: "Notifications", href: "/dashboard/settings?tab=notifications" },
      { label: "Security", href: "/dashboard/settings?tab=security" },
    ]
  },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const pathname = location.pathname;

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(pathname.startsWith("/dashboard/settings"));

  // Sync expansion ONLY on initial entry to settings or if navigated from elsewhere
  // But don't force it to true if it matches, allowing manual toggle
  const prevPathname = useLocation().pathname;
  useEffect(() => {
    if (pathname.startsWith("/dashboard/settings") && !isSettingsExpanded) {
      // Only auto-expand if we just arrived at settings from a non-settings page
      // This is a bit tricky with just location, but for simplicity we'll just remove the forced sync
    }
  }, [pathname]);

  const handleLogout = async () => {
    showToast("Signing out...", "info");
    try {
      await logout();
      showToast("Signed out successfully.", "success");
      navigate("/login");
    } catch (error: any) {
      showToast("Failed to sign out.", "error");
    }
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 24px",
          borderBottom: "1px solid var(--color-border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
        >
          <img src="/LogoNew.png" alt="logo" className="w-auto h-8 object-center object-cover" />
        </Link>
        <button
          onClick={onClose}
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: "700",
            color: "var(--color-text-muted)",
            letterSpacing: "0.1em",
            padding: "0 8px",
            marginBottom: "8px",
          }}
        >
          NAVIGATION
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(({ label, href, icon: Icon, children }) => {
            const isActive = pathname === href || (href.startsWith("/dashboard/settings") && pathname.startsWith("/dashboard/settings"));
            const hasChildren = children && children.length > 0;
            
            return (
              <div key={href} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <Link
                    to={href}
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault();
                        setIsSettingsExpanded(!isSettingsExpanded);
                        navigate(href);
                      } else {
                        onClose();
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      textDecoration: "none",
                      background: isActive ? "rgba(0,229,255,0.08)" : "transparent",
                      borderLeft: isActive
                        ? "2px solid var(--color-accent)"
                        : "2px solid transparent",
                      transition: "all 0.2s ease",
                      color: isActive
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                      fontSize: "14px",
                      fontWeight: isActive ? "600" : "400",
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                      }
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: isActive ? "var(--color-accent)" : "var(--color-text-muted)", flexShrink: 0 }}
                    />
                    {label}
                    {hasChildren ? (
                      <motion.div
                        animate={{ rotate: isSettingsExpanded ? 90 : 0 }}
                        style={{ marginLeft: "auto", display: "flex" }}
                      >
                        <ChevronRight size={13} style={{ color: isActive ? "var(--color-accent)" : "var(--color-text-muted)" }} />
                      </motion.div>
                    ) : (
                      isActive && (
                        <ChevronRight
                          size={13}
                          style={{ color: "var(--color-accent)", marginLeft: "auto" }}
                        />
                      )
                    )}
                  </Link>

                {hasChildren && isSettingsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden", paddingLeft: "36px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}
                  >
                    {children.map((child) => {
                      const isChildActive = pathname + location.search === child.href;
                      return (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={onClose}
                          style={{
                            padding: "8px 0",
                            fontSize: "13px",
                            color: isChildActive ? "var(--color-accent)" : "var(--color-text-muted)",
                            textDecoration: "none",
                            transition: "color 0.2s ease",
                            fontWeight: isChildActive ? "600" : "400",
                          }}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--color-border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            background: "rgba(0,229,255,0.04)",
            border: "1px solid rgba(0,229,255,0.1)",
            borderRadius: "10px",
            cursor: "help"
          }}
          onClick={() => showToast("AI Engine is operating at peak efficiency.", "success")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <div
              className="animate-pulse"
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 8px #22C55E"
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.02em"
              }}
            >
              ENGINE ONLINE
            </span>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Cpu size={10} />
            GPU utilization: 34%
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            background: "transparent",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "8px",
            color: "var(--color-text-muted)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "var(--font-dashboard)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
             e.currentTarget.style.color = "#EF4444";
             e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
             e.currentTarget.style.background = "rgba(239,68,68,0.05)";
          }}
          onMouseLeave={(e) => {
             e.currentTarget.style.color = "var(--color-text-muted)";
             e.currentTarget.style.borderColor = "var(--color-border-subtle)";
             e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:block"
        style={{
          width: "240px",
          background: "var(--color-bg-secondary)",
          borderRight: "1px solid var(--color-border-subtle)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 100,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 200,
              }}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.25 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: "240px",
                background: "var(--color-bg-secondary)",
                borderRight: "1px solid var(--color-border-subtle)",
                zIndex: 201,
                overflowY: "auto",
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* Sidebar Scrollbar Styling */
        nav::-webkit-scrollbar,
        aside::-webkit-scrollbar {
          width: 4px;
        }
        
        nav::-webkit-scrollbar-track,
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        
        nav::-webkit-scrollbar-thumb,
        aside::-webkit-scrollbar-thumb {
          background: var(--color-border-subtle);
          border-radius: 10px;
        }
        
        nav::-webkit-scrollbar-thumb:hover,
        aside::-webkit-scrollbar-thumb:hover {
          background: var(--color-accent);
        }

        /* For Firefox */
        nav, aside {
          scrollbar-width: thin;
          scrollbar-color: var(--color-border-subtle) transparent;
        }
      `}</style>
    </>
  );
}

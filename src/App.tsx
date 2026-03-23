import { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import Reports from "@/pages/dashboard/Reports";
import Repositories from "@/pages/dashboard/Repositories";
import Security from "@/pages/dashboard/Security";
import Settings from "@/pages/dashboard/Settings";
import SystemStatus from "@/pages/dashboard/SystemStatus";
import Verifications from "@/pages/dashboard/Verifications";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import AIModels from "@/pages/dashboard/AIModels";
import LivePreview from "@/pages/dashboard/LivePreview";
import ScrollToTop from "@/components/common/ScrollToTop";



function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  if (loading) return null; // or a loading spinner
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-dashboard)",
      }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          marginLeft: "240px",
        }}
        className="dashboard-ml"
      >
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main
          style={{
            flex: 1,
            padding: "24px",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-ml { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>

      {/* Auth Routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <SignIn />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
      
      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="reports" element={<Reports />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="security" element={<Security />} />
          <Route path="settings" element={<Settings />} />
          <Route path="system-status" element={<SystemStatus />} />
          <Route path="verifications" element={<Verifications />} />
          <Route path="ai-fleet" element={<AIModels />} />
          <Route path="live-preview" element={<LivePreview />} />

        </Route>
      </Route>

      {/* Redirect all other routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}


export default App;

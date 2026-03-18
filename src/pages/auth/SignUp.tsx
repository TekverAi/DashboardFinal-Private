import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, `${firstName} ${lastName}`);
      showToast("Account created successfully!", "success");
      navigate("/dashboard");
    } catch (error: any) {
      showToast(error.message || "Failed to create account.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast("Signed in with Google!", "success");
      navigate("/dashboard");
    } catch (error: any) {
      showToast(error.message || "Google sign-in failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      desktopImage="/auth-desk.webp"
      mobileImage="/auth-mbile.webp"
      tagline="Capturing Moments, Creating Memories."
    >
      <div style={{ maxWidth: "420px", width: "100%", margin: "auto", fontFamily: "var(--font-dashboard)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--color-text-primary)", marginBottom: "4px" }}>Create an account</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--color-accent)", fontWeight: "700", textDecoration: "none" }}>Log in</Link>
        </p>

        <form onSubmit={handleEmailSignup} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                color: "var(--color-text-primary)",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                fontFamily: "var(--font-dashboard)"
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            <input
              type="text"
              required
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                color: "var(--color-text-primary)",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                fontFamily: "var(--font-dashboard)"
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 20px",
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              color: "var(--color-text-primary)",
              fontSize: "15px",
              outline: "none",
              transition: "all 0.2s",
              fontFamily: "var(--font-dashboard)"
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 48px 16px 20px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                color: "var(--color-text-primary)",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                fontFamily: "var(--font-dashboard)"
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                display: "flex"
              }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
             <input type="checkbox" id="terms" required style={{ accentColor: "var(--color-accent)" }} />
             <label htmlFor="terms" style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
               I agree to the Terms & Conditions
             </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "var(--color-accent)",
              border: "none",
              borderRadius: "var(--radius-lg)",
              color: "#020617",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              boxShadow: "0 10px 20px var(--color-accent-glow)",
              marginTop: "4px",
              fontFamily: "var(--font-dashboard)"
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div style={{ position: "relative", textAlign: "center", margin: "24px 0 16px" }}>
           <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "var(--color-border-subtle)" }} />
           <span style={{ position: "relative", background: "var(--color-bg-secondary)", padding: "0 12px", fontSize: "12px", color: "var(--color-text-muted)", fontWeight: "600" }}>Or continue with</span>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleGoogleSignup}
            style={{
              flex: 1,
              padding: "14px",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              color: "var(--color-text-primary)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s",
              fontFamily: "var(--font-dashboard)"
            }}
            onMouseEnter={(e) => {
               e.currentTarget.style.background = "var(--color-surface)";
               e.currentTarget.style.borderColor = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
               e.currentTarget.style.background = "transparent";
               e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            <img src="https://authjs.dev/img/providers/google.svg" width="18" height="18" alt="Google" />
            Google Account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

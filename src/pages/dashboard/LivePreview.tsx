import { motion, AnimatePresence } from "framer-motion";
import { Play, AlertTriangle, CheckCircle2, Info, XCircle, ShieldCheck, X, Code2, Loader2, Cpu } from "lucide-react";
import { useState, useRef } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Issue {
  severity: "High" | "Medium" | "Low" | "Info";
  title: string;
  description: string;
  line: number | null;
}

interface ReviewResult {
  language: string;
  summary: string;
  score: number;
  issues: Issue[];
  recommendations: string[];
  error?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const SEVERITY_CONFIG = {
  High: { icon: XCircle, color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
  Medium: { icon: AlertTriangle, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  Low: { icon: AlertTriangle, color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
  Info: { icon: Info, color: "var(--color-accent)", bg: "rgba(0,229,255,0.06)", border: "rgba(0,229,255,0.2)" },
};

function scoreColor(score: number) {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-danger)";
}

function detectLanguage(code: string): string {
  // Python: def, if __name__ == "__main__", import (without from '...' or from "..."), or from ... import
  if (/\bdef\s+\w+\s*\(/.test(code) || 
      /if\s+__name__\s+==\s+['"]__main__['"]/.test(code) || 
      (/import\s+\w+/.test(code) && !/import\s+.*\s+from\s+['"]/.test(code) && !/from\s+.*\s+import/.test(code)) ||
      /\bfrom\s+\w+\s+import\b/.test(code)) return "Python";
  
  // React / JavaScript / TypeScript: JSX tags, React hooks, arrow functions, const/let, import ... from '...'
  if (/<[a-zA-Z][^>]*>/.test(code) || 
      /\b(useState|useEffect|useContext|useReducer|useMemo|useCallback|useRef|useLayoutEffect|useImperativeHandle|useDebugValue)\b/.test(code) ||
      /\bimport\s+.*\s+from\s+['"]/.test(code) ||
      /\bexport\s+(default\s+)?(function|const|class|interface|type)\b/.test(code) ||
      /\b(const|let|var)\s+\w+\s*=/.test(code) ||
      /=>/.test(code)) return "JavaScript/React";
  
  // Java: public class, System.out, private/protected/public method
  if (/\bpublic\s+class\b/.test(code) || /\bSystem\.out\.print/.test(code) || /\b(public|private|protected)\s+\w+\s+\w+\s*\(/.test(code)) return "Java";
  
  // Rust: fn, match, pub, impl, let mut
  if (/\bfn\s+\w+/.test(code) || /\bmatch\s+\w+\s*\{/.test(code) || /\blet\s+mut\b/.test(code) || /\bimpl\s+\w+/.test(code)) return "Rust";
  
  // Go: package main, func, type ... struct
  if (/\bpackage\s+main\b/.test(code) || /\bfunc\s+\w+/.test(code) || /\btype\s+\w+\s+struct\b/.test(code)) return "Go";
  
  // PHP: <?php, function, $, -> (but not Rust's ->)
  if (/<\?php/.test(code) || /\$\w+/.test(code)) return "PHP";
  
  // C#: namespace, using System, [Attribute]
  if (/\bnamespace\s+\w+/.test(code) || /\busing\s+System(\.\w+)?\s*;/.test(code) || /\[\w+\]/.test(code)) return "C#";
  
  return "Code";
}


/* ─── Line limit warning modal ───────────────────────────────────────────── */
function LineWarningModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
      style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        onClick={e => e.stopPropagation()}
        className="relative p-8 max-w-md w-full"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
          style={{ background: "none", border: "none" }}>
          <X size={18} />
        </button>

        <div className="flex items-center justify-center mb-5"
          style={{
            width: 56, height: 56, borderRadius: "14px",
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)"
          }}>
          <AlertTriangle size={26} style={{ color: "#F59E0B" }} />
        </div>

        <h3 className="text-[18px] font-bold text-white mb-2">Code Too Large</h3>
        <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mb-6">
          The live reviewer supports up to <span className="text-white font-semibold">200 lines</span> of code.
          Your snippet has exceeded this limit.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-[14px] font-bold cursor-pointer transition-all"
          style={{
            background: "rgba(0,229,255,0.06)", color: "var(--color-accent)",
            border: "1px solid rgba(0,229,255,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,229,255,0.12)";
            e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,229,255,0.06)";
            e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)";
          }}
        >
          Got it, I&apos;ll trim it
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Results panel ──────────────────────────────────────────────────────── */
function ResultsPanel({ result }: { result: ReviewResult }) {
  const score = result.score ?? 0;
  const color = scoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* Score and Summary Card */}
      <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "24px",
          background: "rgba(255,255,255,0.01)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "16px"
        }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            {/* Score circle */}
            <div className="relative w-[80px] h-[80px] flex items-center justify-center shrink-0">
                <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="35" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="40" cy="40" r="35" fill="transparent" stroke={color} strokeWidth="6" strokeDasharray="219.9" strokeDashoffset={219.9 - (219.9 * score) / 100} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
                </svg>
                <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color, fontFamily: "var(--font-mono)" }}>{score}</div>
                <div style={{ fontSize: "9px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Score</div>
                </div>
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <ShieldCheck size={14} style={{ color: "var(--color-accent)" }} />
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Security Audit Result</span>
                </div>
                <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>{result.summary}</p>
            </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-accent)", border: "1px solid rgba(0,229,255,0.2)", background: "rgba(0,229,255,0.06)", padding: "2px 10px", borderRadius: "99px" }}>
              {result.language.toUpperCase()}
            </span>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", border: "1px solid var(--color-border-subtle)", background: "rgba(255,255,255,0.03)", padding: "2px 10px", borderRadius: "99px" }}>
              AUTO_SCAN_V2
            </span>
        </div>
      </div>

      {/* Issues */}
      {result.issues?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Known Vulnerabilities</span>
            <span style={{ fontSize: "10px", fontWeight: "700", background: "rgba(255,255,255,0.03)", color: "var(--color-text-muted)", borderRadius: "99px", border: "1px solid var(--color-border-subtle)", padding: "2px 8px" }}>{result.issues.length} ISSUES</span>

          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {result.issues.map((issue, i) => {
              const cfg = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.Info;
              const IssueIcon = cfg.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    padding: "16px", 
                    background: "rgba(255,255,255,0.01)", 
                    border: `1px solid var(--color-border-subtle)`, 
                    borderRadius: "12px",
                    display: "flex",
                    gap: "16px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = cfg.border;
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-subtle)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ 
                        width: "32px", height: "32px", borderRadius: "8px", 
                        background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                    <IssueIcon size={16} style={{ color: cfg.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", fontWeight: "800", color: cfg.color, textTransform: "uppercase" }}>{issue.severity}</span>
                      {issue.line && <span style={{ fontSize: "10px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.03)", padding: "1px 6px", borderRadius: "4px" }}>L{issue.line}</span>}
                      <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-primary)" }}>{issue.title}</h4>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>{issue.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 4px" }}>Actionable Recommendations</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
            {result.recommendations.map((rec, i) => (
              <div key={i} style={{ 
                    padding: "12px 16px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--color-border-subtle)", borderRadius: "10px",
                    display: "flex", gap: "10px", alignItems: "flex-start"
                }}>
                <CheckCircle2 size={14} style={{ color: "var(--color-accent)", marginTop: "2px", flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function findLine(code: string, pattern: RegExp): number | null {
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    if (pattern.test(lines[i])) return i + 1;
  }
  return null;
}

function buildFallbackReview(code: string, language?: string | null): ReviewResult {
  const issues: Issue[] = [];

  if (code.trim().length < 5) {
    return {
      language: "Unknown",
      summary: "The provided snippet is too short to be analyzed effectively.",
      score: 0,
      issues: [{ severity: "High", title: "Empty or invalid input", description: "Please provide valid source code for analysis.", line: null }],
      recommendations: ["Ensure you paste a complete code block."]
    };
  }

  // Simple heuristic for "is this even code?"
  const codeLines = code.split("\n").filter(l => l.trim().length > 0);
  const seemsLikeGarbage = codeLines.length > 0 && 
    !/[;{}()\[\]=]/.test(code) && 
    !/\b(function|def|const|let|var|if|for|while|import|export|class|pub|fn|func|package)\b/.test(code);

  if (seemsLikeGarbage) {
    issues.push({
      severity: "High",
      title: "Garbage or non-code input detected",
      description: "The input does not appear to follow standard programming syntax patterns.",
      line: null,
    });
  }

  if (/\beval\s*\(/.test(code)) {
    issues.push({
      severity: "High",
      title: "Use of eval()",
      description: "Dynamic code execution via eval() can introduce remote code execution risks.",
      line: findLine(code, /\beval\s*\(/),
    });
  }

  if (/innerHTML\s*=/.test(code)) {
    issues.push({
      severity: "High",
      title: "Unsafe innerHTML assignment",
      description: "Directly assigning to innerHTML may enable XSS if content is not sanitized.",
      line: findLine(code, /innerHTML\s*=/),
    });
  }

  if (/(SELECT|UPDATE|DELETE|INSERT)\s+.*\+|`\s*SELECT.*\$\{/.test(code)) {
    issues.push({
      severity: "Medium",
      title: "Possible SQL injection pattern",
      description: "String interpolation/concatenation in SQL queries should be replaced with parameterized queries.",
      line: findLine(code, /(SELECT|UPDATE|DELETE|INSERT)/),
    });
  }

  // Fallback base score is lower (60) if it looks like code, otherwise much lower
  const baseScore = seemsLikeGarbage ? 20 : 70;
  const score = Math.max(0, baseScore - issues.length * 15);
  const detectedLanguage = language || detectLanguage(code);

  return {
    language: detectedLanguage,
    summary:
      issues.length > 0
        ? "Live fallback analysis detected security or structural risks. Manual review is highly recommended."
        : "Live fallback analysis was used. No obvious high-risk security patterns were detected, but logic verification was limited.",
    score,
    issues,
    recommendations: [
      "Use parameterized queries for all database operations.",
      "Store secrets in environment variables or a secrets manager.",
      "Add input validation and output encoding on untrusted data paths.",
    ],
  };
}


/* ─── Main section ───────────────────────────────────────────────────────── */
export default function LivePreview() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumsRef = useRef<HTMLDivElement>(null);

  const lineCount = code.split("\n").length;
  const detectedLang = code.trim() ? detectLanguage(code) : null;

  async function handleReview() {
    if (!code.trim()) return;
    if (lineCount > 200) { setShowWarning(true); return; }

    setLoading(true);
    setResult(null);
    setError(null);

    const apiKey = import.meta.env.VITE_FIREBASE_GROQ_API_KEY;
    if (!apiKey) {
      setError("Groq API key not configured.");
      setLoading(false);
      return;
    }

    const systemInstruction = `You are TekverAI, a high-performance code analysis engine.
Your task is to perform a RIGOROUS and CRITICAL review of the provided code.

DANGER: If the code contains syntax errors, incomplete logic, or is total garbage, you MUST give a score below 30.

Detailed Review Criteria:
1. Syntax & Logic: IF CODE IS NON-FUNCTIONAL, INCOMPLETE, OR HAS SYNTAX ERRORS, IT IS A CRITICAL FAILURE. Penalize heavily.
2. Security: Identify vulnerabilities (XSS, Injection, Hardcoded Secrets, etc.).
3. Best Practices: Suggest improvements for readability, performance, and maintainability.

Scoring Rubric (CRITICAL):
- 90-100: Exceptional, production-ready, zero issues.
- 75-89: Good quality, minor improvements suggested.
- 50-74: Working code but with significant security risks or poor practices.
- 30-49: Non-functional code, minor syntax errors, or major security holes.
- 0-29: Garbage input, critical syntax errors, or malicious code.

Return a structured JSON response with this exact shape:
{
  "language": "<detected language>",
  "summary": "<comprehensive 2-3 sentence assessment focusing on WHY the score was given>",
  "score": <integer 0-100 based on the rubric>,
  "issues": [
    {
      "severity": "High" | "Medium" | "Low" | "Info",
      "title": "<short descriptive title>",
      "description": "<detailed impact and fix>",
      "line": <line number or null>
    }
  ],
  "recommendations": ["<specific actionable recommendation>", "..."]
}
Return ONLY the raw JSON object. No commentary outside the JSON.`;


    const userPrompt = detectedLang
      ? `Review this ${detectedLang} code:\n\n${code}`
      : `Review this code (auto-detect language):\n\n${code}`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        setResult(buildFallbackReview(code, detectedLang));
      } else {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          try {
            const cleaned = content.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
            setResult(JSON.parse(cleaned));
          } catch {
            setResult(buildFallbackReview(code, detectedLang));
          }
        } else {
          setResult(buildFallbackReview(code, detectedLang));
        }
      }
    } catch (err) {
      console.error(err);
      setResult(buildFallbackReview(code, detectedLang));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <AnimatePresence>
        {showWarning && <LineWarningModal onClose={() => setShowWarning(false)} />}
      </AnimatePresence>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            Live Code Review
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Instant AI-powered security audit and logic verification
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
             <div className="animate-pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-success)", boxShadow: "0 0 8px var(--color-success)" }} />
             <span style={{ fontSize: "11px", color: "var(--color-success)", fontWeight: "700", letterSpacing: "0.05em" }}>SYSTEM READY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Code editor panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-professional"
          style={{ padding: 0, display: "flex", flexDirection: "column", height: "600px" }}

        >
          {/* Editor header */}
          <div style={{ 
                padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", 
                display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.01)" 
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Code2 size={16} style={{ color: "var(--color-accent)" }} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>
                {detectedLang ? `${detectedLang} Analyzer` : "Code Analyzer"}
              </span>
            </div>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              {lineCount} / 200
            </span>
          </div>

          <div style={{ flex: 1, position: "relative", display: "flex", overflow: "hidden" }}>
            {/* Line numbers */}
            <div ref={lineNumsRef} className="w-12 bg-black/20 border-r border-white/5 py-5 flex flex-col items-center select-none overflow-hidden">
              {Array.from({ length: Math.min(Math.max(1, lineCount), 200) }).map((_, i) => (
                <div key={i} className="text-[11px] font-mono leading-relaxed h-[21px] text-slate-700">
                  {i + 1}
                </div>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => { setCode(e.target.value); setResult(null); setError(null); }}
              onScroll={() => {
                if (lineNumsRef.current && textareaRef.current) {
                  lineNumsRef.current.scrollTop = textareaRef.current.scrollTop;
                }
              }}
              placeholder={`// Paste your source code here...\n// Supports JS, Python, Java, Go, Rust, and more.`}
              style={{
                flex: 1, resize: "none", outline: "none", border: "none", padding: "20px",
                background: "transparent", color: "var(--color-text-primary)", 
                fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: "1.6",
                scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent"
              }}
              spellCheck={false}
            />
          </div>

          {/* Editor footer */}
          <div style={{ 
                padding: "16px 20px", borderTop: "1px solid var(--color-border-subtle)", 
                display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.01)" 
            }}>
            <button 
              onClick={() => { setCode(""); setResult(null); setError(null); }}
              style={{ 
                background: "none", border: "none", fontSize: "12px", fontWeight: "700", 
                color: "var(--color-text-muted)", cursor: "pointer", transition: "color 0.2s" 
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
            >
              CLEAR EDITOR
            </button>

            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              style={{
                padding: "10px 24px",
                background: loading || !code.trim() ? "rgba(255,255,255,0.03)" : "var(--color-accent)",
                border: "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "800",
                color: loading || !code.trim() ? "var(--color-text-muted)" : "var(--color-bg-primary)",
                cursor: loading || !code.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-dashboard)",
                boxShadow: loading || !code.trim() ? "none" : "0 4px 15px rgba(0,229,255,0.15)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!loading && code.trim()) {
                  e.currentTarget.style.filter = "brightness(1.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && code.trim()) {
                  e.currentTarget.style.filter = "none";
                  e.currentTarget.style.transform = "none";
                }
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
              {loading ? "ANALYZING..." : "START REVIEW"}
            </button>
          </div>
        </motion.div>

        {/* ── Results panel ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="card-professional"
          style={{ padding: 0, display: "flex", flexDirection: "column", height: "600px" }}

        >
            <div style={{ 
                padding: "16px 20px", borderBottom: "1px solid var(--color-border-subtle)", 
                display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.01)" 
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShieldCheck size={16} style={{ color: "var(--color-accent)" }} />
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-primary)" }}>Audit Report</span>
                </div>
            </div>

            <div style={{ flex: 1, padding: "24px", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}>
              {!result && !loading && !error && (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "40px 0", color: "var(--color-text-muted)", textAlign: "center" }}>

                  <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-text-secondary)", marginBottom: "4px" }}>Awaiting Analysis</h4>
                    <p style={{ fontSize: "12px", maxWidth: "240px", lineHeight: "1.5" }}>Paste your source code and click start review for an instant AI security audit.</p>
                  </div>
                </div>
              )}

              {loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ height: "100px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: "150px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
                </div>
              )}

              {error && (
                <div style={{ 
                    padding: "20px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "16px",
                    display: "flex", gap: "12px", alignItems: "flex-start"
                }}>
                  <XCircle size={18} style={{ color: "#EF4444", marginTop: "2px" }} />
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#EF4444", marginBottom: "4px" }}>Verification Failed</h4>
                    <p style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{error}</p>
                  </div>
                </div>
              )}

              {result && !loading && <ResultsPanel result={result} />}
            </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import SecurityDots from "./SecurityDots";

interface AuthLayoutProps {
  children: React.ReactNode;
  desktopImage: string;
  mobileImage: string;
  quote?: string;
  tagline?: string;
}

export default function AuthLayout({ children, desktopImage, mobileImage, quote, tagline }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-[var(--color-bg-primary)] overflow-x-hidden relative">
      <div 
        className="flex flex-col lg:flex-row w-full min-h-screen bg-[var(--color-bg-secondary)]"
      >
        {/* Top/Left column: Visual Section */}
        <div 
          className="flex w-full h-[35vh] sm:h-[45vh] md:h-[50vh] lg:h-auto lg:min-h-screen lg:w-[48%] relative overflow-hidden flex-col p-6 sm:p-10 lg:p-[60px] justify-center shrink-0"
        >
          {/* Desktop Image */}
          <div 
            className="hidden lg:block absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${desktopImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7) contrast(1.1)"
            }}
          />
          {/* Mobile Image */}
          <div 
            className="lg:hidden absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${mobileImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7) contrast(1.1)"
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, var(--color-bg-primary) 100%)",
            zIndex: 1
          }} />

          {/* Animated Security Dots */}
          <SecurityDots />

          {/* Logo & Back button - Fixed at top */}
          <div className="absolute top-6 left-6 right-6 lg:top-[60px] lg:left-[60px] lg:right-[60px] z-10 flex items-center justify-between">
            <div className="">
              <img src="/LogoNew.png" alt="Logo" className="w-auto h-8 object-center object-cover" />
            </div>
            
            <a 
              href="https://tekverai.com/" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-[12px] sm:text-[13px] font-semibold no-underline flex items-center gap-2 transition-all font-dashboard hover:bg-[rgba(255,255,255,0.1)]"
            >
              <span className="hidden sm:inline">Back to website</span>
              <span className="sm:hidden">Back</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="mt-auto relative z-10 hidden lg:block">
            {tagline && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative pl-8 border-l-4 border-[var(--color-accent)] py-2"
              >
                <div className="absolute inset-0 bg-[var(--color-accent-glow)] blur-3xl opacity-20 -z-10" />
                <motion.h2 
                  className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-[var(--color-text-primary)] leading-[1.1] mb-2 font-dashboard tracking-tight"
                  style={{
                    textShadow: "0 0 20px rgba(34, 211, 238, 0.3)"
                  }}
                >
                  {tagline.split(", ").map((part, i) => (
                    <span key={i} className="block">
                      {part}{i === 0 ? "," : ""}
                    </span>
                  ))}
                </motion.h2>
                <div className="h-1 w-24 bg-gradient-to-right from-[var(--color-accent)] to-transparent opacity-50 mt-4 rounded-full" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom/Right column: Form Section */}
        <div 
          className="flex-1 flex flex-col p-6 sm:p-10 lg:py-12 lg:px-20 items-center justify-center bg-[var(--color-bg-secondary)] z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)] lg:shadow-none min-h-[50vh] md:min-h-[60vh] lg:min-h-screen w-full lg:w-auto overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

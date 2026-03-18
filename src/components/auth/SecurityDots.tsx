import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

export default function SecurityDots() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const newDots = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 10 + 5,
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          initial={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            opacity: 0,
          }}
          animate={{
            left: [
              `${dot.x}%`,
              `${(dot.x + (Math.random() * 20 - 10)) % 100}%`,
              `${dot.x}%`,
            ],
            top: [
              `${dot.y}%`,
              `${(dot.y + (Math.random() * 20 - 10)) % 100}%`,
              `${dot.y}%`,
            ],
            opacity: [0, dot.opacity, 0],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            borderRadius: "50%",
            backgroundColor: "var(--color-accent)",
            boxShadow: `0 0 ${dot.size * 2}px var(--color-accent)`,
          }}
        />
      ))}
    </div>
  );
}

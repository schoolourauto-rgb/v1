import { ReactNode } from "react";
import { motion } from "framer-motion";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-lg shadow-black/10 transition duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

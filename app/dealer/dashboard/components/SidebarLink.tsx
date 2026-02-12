import React from "react";
import { Car, User, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const icons: Record<string, React.ReactNode> = {
  "Posted Cars": <Car className="w-4 h-4 mr-2" />,
  "Edit Profile": <User className="w-4 h-4 mr-2" />,
  "Guidelines": <BookOpen className="w-4 h-4 mr-2" />,
};

interface SidebarLinkProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarLink({ label, active, onClick }: SidebarLinkProps) {
  return (
    <motion.button
      className={`w-full flex items-center rounded-lg px-3 py-2 transition-colors hover:bg-muted/50 cursor-pointer text-base font-medium ${active ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-3" : "text-foreground"}`}
      onClick={onClick}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icons[label]}
      {label}
    </motion.button>
  );
}

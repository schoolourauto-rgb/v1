import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "btn btn-primary"
      : "btn btn-secondary";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ filter: "brightness(1.07)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(variantClass, className)}
      {...props}
    />
  );
}

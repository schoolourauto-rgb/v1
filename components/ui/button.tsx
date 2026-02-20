
import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "default" | "outline" | "ghost"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ filter: "brightness(1.07)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={className}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

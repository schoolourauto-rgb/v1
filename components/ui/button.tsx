import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 hover:brightness-110 active:scale-95";

  const variants = {
    primary:
      "bg-yellow-500 text-black hover:scale-105",
    secondary:
      "border border-yellow-500 text-black dark:text-white hover:bg-yellow-500 hover:text-black",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}

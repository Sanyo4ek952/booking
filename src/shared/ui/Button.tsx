import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
  disableHoverLift?: boolean;
};

export function Button({
  asChild,
  className,
  variant = "primary",
  size = "md",
  disableHoverLift = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const shouldDisableHoverLift = disableHoverLift || className?.includes("-translate-y-1/2");

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border font-medium transition disabled:pointer-events-none disabled:opacity-50",
        !shouldDisableHoverLift && "hover:-translate-y-0.5",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600",
        variant === "primary" && "border-sage-700 bg-sage-700 text-white shadow-lg shadow-sage-700/20 hover:bg-sage-600",
        variant === "secondary" && "border-sand-200 bg-white text-graphite-900 shadow-sm hover:border-sage-600/40",
        variant === "ghost" && "border-transparent bg-transparent text-graphite-700 hover:bg-white/70",
        variant === "danger" && "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "icon" && "h-10 w-10 p-0",
        className,
      )}
      {...props}
    />
  );
}

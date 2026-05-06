import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-white/80 bg-white/86 shadow-xl shadow-stone-900/7 backdrop-blur", className)}
      {...props}
    />
  );
}

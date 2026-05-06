import * as LabelPrimitive from "@radix-ui/react-label";
import type { HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export function Field({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn("text-sm font-medium text-graphite-700", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 rounded-2xl border border-sand-200 bg-white px-4 text-sm text-graphite-900 shadow-sm outline-none transition placeholder:text-graphite-500/70 focus:border-sage-600 focus:ring-4 focus:ring-sage-600/10",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 resize-y rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm text-graphite-900 shadow-sm outline-none transition placeholder:text-graphite-500/70 focus:border-sage-600 focus:ring-4 focus:ring-sage-600/10",
        className,
      )}
      {...props}
    />
  );
}

export function NativeSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 rounded-2xl border border-sand-200 bg-white px-4 text-sm text-graphite-900 shadow-sm outline-none transition focus:border-sage-600 focus:ring-4 focus:ring-sage-600/10",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) {
    return null;
  }

  return <p className="text-sm text-red-700">{children}</p>;
}

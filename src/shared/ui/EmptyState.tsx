import type { ReactNode } from "react";
import { CalendarX } from "lucide-react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-sand-200 bg-white/70 px-6 py-12 text-center">
      <CalendarX className="h-10 w-10 text-sage-700" />
      <h3 className="mt-4 text-lg font-semibold text-graphite-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-graphite-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

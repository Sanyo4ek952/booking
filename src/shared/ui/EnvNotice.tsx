import { KeyRound } from "lucide-react";
import { Card } from "./Card";

export function EnvNotice() {
  return (
    <Card className="mx-auto max-w-2xl p-6">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sand-100 text-sage-700">
          <KeyRound className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-graphite-900">Supabase не настроен</h2>
          <p className="mt-2 text-sm leading-6 text-graphite-500">
            Создайте файл <code className="rounded bg-sand-100 px-1.5 py-0.5">.env</code> на основе{" "}
            <code className="rounded bg-sand-100 px-1.5 py-0.5">.env.example</code> и заполните{" "}
            <code className="rounded bg-sand-100 px-1.5 py-0.5">VITE_SUPABASE_URL</code> и{" "}
            <code className="rounded bg-sand-100 px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </div>
    </Card>
  );
}

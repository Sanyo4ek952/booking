import { BedDouble, CalendarCheck, LayoutDashboard } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-sand-50/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-graphite-900 text-white shadow-lg shadow-stone-900/20">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold uppercase tracking-wide text-graphite-900">Apart Reserve</div>
              <div className="truncate text-xs text-graphite-500">4 объекта, актуальная занятость</div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "rounded-2xl px-3 py-2 text-sm font-medium text-graphite-700 hover:bg-white",
                  isActive && "bg-white text-graphite-900 shadow-sm",
                )
              }
            >
              Календарь
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-graphite-700 hover:bg-white",
                  isActive && "bg-white text-graphite-900 shadow-sm",
                )
              }
            >
              <BedDouble className="h-4 w-4" />
              Номера
            </NavLink>
            <Button asChild variant="secondary" size="sm">
              <NavLink to="/admin">
                <LayoutDashboard className="h-4 w-4" />
                Админ
              </NavLink>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

import {
  BedDouble,
  Bell,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  Globe2,
  House,
  LayoutDashboard,
  Plus,
  UserRound,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";

type NavItem = {
  href: string;
  label: string;
  icon: typeof CalendarDays;
  isActive: (pathname: string, hash: string) => boolean;
};

const adminNavItems: NavItem[] = [
  {
    href: "/admin",
    label: "Публичная страница",
    icon: Globe2,
    isActive: (pathname) => pathname === "/admin",
  },
  {
    href: "/admin/bookings",
    label: "Бронирования",
    icon: CalendarDays,
    isActive: (pathname) => pathname.startsWith("/admin/bookings"),
  },
];

const publicNavItems: NavItem[] = [
  {
    href: "/rooms",
    label: "Номера",
    icon: BedDouble,
    isActive: (pathname) => pathname === "/rooms" || pathname.startsWith("/rooms/"),
  },
  {
    href: "/admin",
    label: "Админ",
    icon: LayoutDashboard,
    isActive: (pathname) => pathname.startsWith("/admin"),
  },
];

function getHeaderSubtitle(pathname: string) {
  if (pathname === "/admin") {
    return "Управление публичной ссылкой";
  }

  if (pathname.startsWith("/admin")) {
    return "Управление бронированиями";
  }

  if (pathname.startsWith("/rooms/")) {
    return "Карточка номера для гостя";
  }

  return "Публичная витрина для гостей";
}

export function RootLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const headerSubtitle = getHeaderSubtitle(location.pathname);
  const navItems = isAdminRoute ? adminNavItems : publicNavItems;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(247,239,228,0.92)_45%,rgba(251,247,240,0.88))]">
      <header className="sticky top-0 z-30 border-b border-sand-200/80 bg-sand-50/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link to={isAdminRoute ? "/admin" : "/rooms"} className="flex min-w-0 items-center gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-graphite-900 text-white shadow-[0_14px_28px_rgba(32,33,31,0.18)]">
              <House className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-graphite-900 sm:text-xl">Гостевой дом</div>
              <div className="flex items-center gap-1 truncate text-sm text-graphite-500">
                <span>{headerSubtitle}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-graphite-400" />
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdminRoute ? (
              <>
                <Link
                  to="/rooms"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-sand-200 bg-white/90 text-graphite-900 shadow-[0_10px_24px_rgba(32,33,31,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(32,33,31,0.14)]"
                  aria-label="Открыть публичную страницу"
                >
                  <ExternalLink className="h-5 w-5" />
                </Link>
                <Link
                  to="/admin/bookings"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-sand-200 bg-white/90 text-graphite-900 shadow-[0_10px_24px_rgba(32,33,31,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(32,33,31,0.14)]"
                  aria-label="Открыть бронирования"
                >
                  <Bell className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <Link
                to="/admin"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-sand-200 bg-white/90 text-graphite-900 shadow-[0_10px_24px_rgba(32,33,31,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(32,33,31,0.14)]"
                aria-label="Перейти в админку"
              >
                <UserRound className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto hidden max-w-7xl items-center justify-between gap-4 px-4 pb-4 sm:flex sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isActive(location.pathname, location.hash);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-amber-300 bg-white text-amber-700 shadow-[0_10px_24px_rgba(165,106,44,0.12)]"
                      : "border-transparent bg-white/60 text-graphite-700 hover:border-sand-200 hover:bg-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {isAdminRoute && (
            <Button asChild variant="primary" size="sm">
              <Link to="/admin/rooms/new">
                <Plus className="h-4 w-4" />
                Создать объект
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-8 lg:px-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200/90 bg-sand-50/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden">
        <div className={`mx-auto grid max-w-md gap-1 ${navItems.length === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive(location.pathname, location.hash);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                  isActive ? "text-amber-700" : "text-graphite-500 hover:text-graphite-900",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl transition",
                    isActive && "bg-white shadow-[0_10px_24px_rgba(165,106,44,0.12)]",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

import { useLayoutEffect } from "react";
import {
  BedDouble,
  Bell,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  Globe2,
  House,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "@/features/auth/AuthProvider";
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
    href: "/admin/login",
    label: "Админ",
    icon: LayoutDashboard,
    isActive: (pathname) => pathname.startsWith("/admin"),
  },
];

function getHeaderSubtitle(pathname: string) {
  if (pathname === "/admin/login") {
    return "Авторизация администратора";
  }

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

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export function RootLayout() {
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();
  const isAdminLoginRoute = location.pathname === "/admin/login";
  const canAccessAdmin = isAuthenticated && !isAdminLoginRoute;
  const headerSubtitle = getHeaderSubtitle(location.pathname);
  const navItems = canAccessAdmin ? adminNavItems : publicNavItems;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(247,239,228,0.92)_45%,rgba(251,247,240,0.88))]">
      <ScrollToTop />
      <header className="sticky top-0 z-30 border-b border-sand-200/80 bg-sand-50/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link to={canAccessAdmin ? "/admin" : "/rooms"} className="flex min-w-0 items-center gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-sage-700 text-white shadow-lg shadow-sage-700/20">
              <House className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-graphite-900 sm:text-xl">Reserve</div>
              <div className="flex items-center gap-1 truncate text-sm text-graphite-500">
                <span>{headerSubtitle}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-graphite-400" />
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {canAccessAdmin ? (
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
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label="Выйти из админки"
                  onClick={signOut}
                  className="rounded-full border-sand-200 bg-white/90 text-graphite-900 shadow-[0_10px_24px_rgba(32,33,31,0.08)]"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link
                to="/admin/login"
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

          {canAccessAdmin && (
            <Button asChild variant="primary" size="sm">
              <Link to="/admin/rooms/new">
                <Plus className="h-4 w-4" />
                Создать объект
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-5 pb-28 sm:px-6 sm:py-8 sm:pb-8 lg:px-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200/90 bg-sand-50/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden">
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

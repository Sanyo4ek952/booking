import { compareAsc, format, parseISO, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronDown, Copy, ExternalLink, Globe2 } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import { rooms } from "@/entities/room";
import { BookingCalendar, formatPrice, priceSections, useBookings } from "@/features/bookings";
import type { Booking } from "@/features/bookings/model/types";
import { isSupabaseConfigured } from "@/shared/api/supabase";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { useToast } from "@/shared/ui/useToast";

function getNearestDate(bookings: Booking[], field: "check_in" | "check_out") {
  const today = startOfDay(new Date());
  const nearestBooking = bookings
    .filter((booking) => parseISO(booking[field]) >= today)
    .sort((left, right) => compareAsc(parseISO(left[field]), parseISO(right[field])))[0];

  return nearestBooking ? format(parseISO(nearestBooking[field]), "d MMMM", { locale: ru }) : "—";
}

export function PublicPage() {
  const { toast } = useToast();
  const { data: bookings = [], isLoading, isError, error } = useBookings();
  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "/rooms";
    }

    return `${window.location.origin}/rooms`;
  }, []);
  const roomActualRows = rooms.map((room) => {
    const roomBookings = bookings.filter((booking) => booking.room_id === room.id);

    return {
      room,
      nearestCheckIn: getNearestDate(roomBookings, "check_in"),
      nearestCheckOut: getNearestDate(roomBookings, "check_out"),
    };
  });

  return (
    <div>
      {!isSupabaseConfigured ? (
        <EnvNotice />
      ) : isError ? (
        <EmptyState
          title="Не удалось загрузить брони"
          description={error instanceof Error ? error.message : "Проверьте настройки Supabase и RLS-политики."}
        />
      ) : (
        <div className="grid gap-4">
          <Card className="p-4 sm:p-5">
            <div className="grid gap-4">
              <div>
                <h2 className="text-lg font-semibold text-graphite-900">Публичная ссылка</h2>
                <p className="text-sm text-graphite-500">Скопируйте ссылку и отправьте её гостю для просмотра номеров.</p>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50 px-4 text-sm text-graphite-900">
                  <Globe2 className="h-4 w-4 shrink-0 text-sage-700" />
                  <span className="truncate">{publicUrl}</span>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(publicUrl);
                      toast({ title: "Ссылка скопирована", description: "Публичную страницу можно отправлять пользователю." });
                    } catch {
                      toast({ title: "Не удалось скопировать", description: "Скопируйте ссылку вручную из поля.", variant: "error" });
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Скопировать
                </Button>

                <Button asChild>
                  <Link to="/rooms">
                    Открыть
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card id="prices" className="scroll-mt-32 p-4 sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-graphite-900">Цены на номера</h2>
            </div>

            <div className="mt-4 grid gap-5">
              {priceSections.map((section) => (
                <details key={section.title} className="group rounded-lg border border-sand-200 bg-sand-50/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-graphite-900 marker:hidden">
                    <span>{section.title}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-graphite-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="grid gap-2 border-t border-sand-200 p-3 sm:grid-cols-2 lg:grid-cols-4">
                    {section.prices.map(({ period, price }) => (
                      <div key={`${section.title}-${period}`} className="rounded-lg border border-sand-200 bg-white/80 p-3">
                        <div className="text-xs font-medium uppercase text-graphite-500">{period}</div>
                        <div className="mt-1 text-xl font-semibold text-graphite-900">{formatPrice(price)} ₽</div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-graphite-900">Актуальные данные</h2>
              <p className="text-sm text-graphite-500">Ближайший заезд и выезд по каждому номеру.</p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {roomActualRows.map(({ room, nearestCheckIn, nearestCheckOut }) => (
                <div key={room.id} className="rounded-lg border border-sand-200 bg-sand-50/70 p-3">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-8 w-8 place-items-center rounded-md text-sm font-semibold text-white ${room.accentClass}`}>
                      {room.shortName}
                    </span>
                    <span className="font-semibold text-graphite-900">{room.name}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md bg-white/80 p-2">
                      <div className="text-[10px] font-semibold uppercase text-graphite-500">Ближайший заезд</div>
                      <div className="mt-1 font-medium text-graphite-900">{nearestCheckIn}</div>
                    </div>
                    <div className="rounded-md bg-white/80 p-2">
                      <div className="text-[10px] font-semibold uppercase text-graphite-500">Ближайший выезд</div>
                      <div className="mt-1 font-medium text-graphite-900">{nearestCheckOut}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <BookingCalendar bookings={bookings} isLoading={isLoading} />

          <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-graphite-900">Управление из админки</h2>
                <p className="text-sm text-graphite-500">Для ручной работы с бронированиями откройте отдельный раздел.</p>
              </div>
              <a
                href="/admin/bookings"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-sand-200 bg-white px-5 text-sm font-medium text-graphite-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-600/40"
              >
                Открыть бронирования
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

import { compareAsc, format, parseISO, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { BookingCalendar, formatPrice, getDiscountedPrice, priceSections, useBookings } from "@/features/bookings";
import type { Booking } from "@/features/bookings/model/types";
import { ChevronDown } from "lucide-react";
import { rooms } from "@/entities/room";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { Card } from "@/shared/ui/Card";
import { isSupabaseConfigured } from "@/shared/api/supabase";

function getNearestDate(bookings: Booking[], field: "check_in" | "check_out") {
  const today = startOfDay(new Date());
  const nearestBooking = bookings
    .filter((booking) => parseISO(booking[field]) >= today)
    .sort((a, b) => compareAsc(parseISO(a[field]), parseISO(b[field])))[0];

  return nearestBooking ? format(parseISO(nearestBooking[field]), "d MMMM", { locale: ru }) : "—";
}

export function PublicPage() {
  const { data: bookings = [], isLoading, isError, error } = useBookings();
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
        <EmptyState title="Не удалось загрузить брони" description={error instanceof Error ? error.message : "Проверьте настройки Supabase и RLS-политики."} />
      ) : (
        <div className="grid gap-4">
          <Card className="p-4 sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-graphite-900">Цены на номера</h2>
              <p className="text-sm text-graphite-500">Цена после скидки 20%, округленная вверх.</p>
            </div>

            <div className="mt-4 grid gap-5">
              {priceSections.map((section) => (
                <details key={section.title} className="group rounded-lg border border-sand-200 bg-sand-50/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-graphite-900 marker:hidden">
                    <span>{section.title}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-graphite-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="grid gap-2 border-t border-sand-200 p-3 sm:grid-cols-2 lg:grid-cols-4">
                    {section.prices.map(({ period, price }) => {
                      const discountedPrice = getDiscountedPrice(price);

                      return (
                        <div key={`${section.title}-${period}`} className="rounded-lg border border-sand-200 bg-white/80 p-3">
                          <div className="text-xs font-medium uppercase text-graphite-500">{period}</div>
                          <div className="mt-1 text-xl font-semibold text-graphite-900">
                            {formatPrice(discountedPrice)} ₽
                          </div>
                          <div className="text-xs text-graphite-500">было {formatPrice(price)} ₽</div>
                        </div>
                      );
                    })}
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

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[460px] border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase text-graphite-500">
                    <th className="border-b border-sand-200 px-3 py-2 font-semibold">Номер</th>
                    <th className="border-b border-sand-200 px-3 py-2 font-semibold">Ближайший заезд</th>
                    <th className="border-b border-sand-200 px-3 py-2 font-semibold">Ближайший выезд</th>
                  </tr>
                </thead>
                <tbody>
                  {roomActualRows.map(({ room, nearestCheckIn, nearestCheckOut }) => (
                    <tr key={room.id} className="border-b border-sand-200">
                      <td className="border-b border-sand-100 px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-semibold text-white ${room.accentClass}`}>
                            {room.shortName}
                          </span>
                          <span className="font-medium text-graphite-900">{room.name}</span>
                        </div>
                      </td>
                      <td className="border-b border-sand-100 px-3 py-3 text-graphite-700">{nearestCheckIn}</td>
                      <td className="border-b border-sand-100 px-3 py-3 text-graphite-700">{nearestCheckOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <BookingCalendar bookings={bookings} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}

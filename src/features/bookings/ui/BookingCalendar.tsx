import * as Dialog from "@radix-ui/react-dialog";
import { addDays, addMonths, differenceInCalendarDays, format, isSameDay, parseISO, startOfMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, LogIn, LogOut, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { rooms } from "@/entities/room";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/ui/Skeleton";
import { cn } from "@/shared/lib/cn";
import { formatRuDate } from "@/shared/lib/date";
import { bookingStatuses, statusClassName, statusLabel } from "../model/status";
import type { Booking, BookingStatus } from "../model/types";

type BookingCalendarProps = {
  bookings: Booking[];
  isLoading?: boolean;
};

type TimelineBooking = {
  booking: Booking;
  startsBeforeView: boolean;
  endsAfterView: boolean;
  startColumn: number;
  span: number;
};

const visibleDays = 31;
const visibleDayParts = visibleDays * 2;

const statusBarClassName: Record<BookingStatus, string> = {
  reserved: "border-amber-300 bg-amber-100 text-amber-950 shadow-amber-200/70",
  paid: "border-sage-600/30 bg-sage-100 text-sage-900 shadow-sage-200/80",
  living: "border-blue-300 bg-blue-100 text-blue-950 shadow-blue-200/70",
  checked_out: "border-zinc-300 bg-zinc-100 text-zinc-800 shadow-zinc-200/70",
};

function getVisibleBooking(booking: Booking, viewStart: Date, viewEnd: Date): TimelineBooking | null {
  const checkIn = parseISO(booking.check_in);
  const checkOut = parseISO(booking.check_out);

  if (checkOut < viewStart || checkIn >= viewEnd) {
    return null;
  }

  const startOffset = differenceInCalendarDays(checkIn, viewStart);
  const endOffset = differenceInCalendarDays(checkOut, viewStart);
  const startColumn = Math.max(0, startOffset * 2 + 1);
  const endColumn = Math.min(visibleDayParts, endOffset * 2 + 1);
  const span = Math.max(1, endColumn - startColumn);

  return {
    booking,
    startsBeforeView: startOffset < 0,
    endsAfterView: endOffset > visibleDays,
    startColumn,
    span,
  };
}

export function BookingCalendar({ bookings, isLoading }: BookingCalendarProps) {
  const [anchorDate, setAnchorDate] = useState(startOfMonth(new Date()));
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const calendarGridColumns = `36px repeat(${visibleDays}, minmax(24px, 1fr))`;
  const desktopCalendarGridColumns = `minmax(104px, 124px) repeat(${visibleDays}, minmax(24px, 1fr))`;
  const daysGridColumns = `repeat(${visibleDays}, minmax(24px, 1fr))`;
  const bookingGridColumns = `repeat(${visibleDayParts}, minmax(12px, 1fr))`;

  const days = useMemo(
    () => Array.from({ length: visibleDays }, (_, index) => addDays(anchorDate, index)),
    [anchorDate],
  );
  const viewEnd = useMemo(() => addDays(anchorDate, visibleDays), [anchorDate]);

  const bookingsByRoom = useMemo(
    () =>
      rooms.map((room) => ({
        room,
        bookings: bookings
          .filter((booking) => booking.room_id === room.id)
          .map((booking) => getVisibleBooking(booking, anchorDate, viewEnd))
          .filter((booking): booking is TimelineBooking => Boolean(booking))
          .sort((a, b) => a.startColumn - b.startColumn),
      })),
    [anchorDate, bookings, viewEnd],
  );

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="mt-6 grid gap-3">
          {rooms.map((room) => (
            <Skeleton key={room.id} className="h-24 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-sand-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sand-100 text-sage-700">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-graphite-900">Календарь броней</h2>
            <p className="text-sm text-graphite-500">
              {format(days[0], "d MMM", { locale: ru })} - {format(days.at(-1)!, "d MMM yyyy", { locale: ru })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => setAnchorDate((date) => addMonths(date, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => setAnchorDate(startOfMonth(new Date()))}>
            <CalendarDays className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => setAnchorDate((date) => addMonths(date, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-b border-sand-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-graphite-500">
          {bookingStatuses.map((status) => (
            <span key={status.value} className="inline-flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full border", status.className)} />
              {status.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <LogIn className="h-3.5 w-3.5 text-sage-700" />
            заезд
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LogOut className="h-3.5 w-3.5 text-graphite-500" />
            выезд
          </span>
        </div>
      </div>

      <div className="booking-calendar-scroll overflow-x-auto">
        <div className="min-w-max p-3 pb-4 sm:w-full sm:p-4">
          <div
            className="booking-calendar-grid grid gap-y-2 sm:gap-y-1.5"
            style={{
              "--booking-calendar-columns": calendarGridColumns,
              "--booking-calendar-desktop-columns": desktopCalendarGridColumns,
            } as CSSProperties}
          >
            <div className="sticky left-0 z-20 w-9 bg-white shadow-[8px_0_14px_-14px_rgba(32,33,31,0.45)] sm:w-auto" />
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "grid h-12 place-items-center rounded-lg border border-sand-200 bg-sand-50/70 px-1 text-center text-sm font-semibold leading-none text-graphite-700 sm:h-10 sm:rounded-none sm:border-x-0 sm:border-t-0 sm:bg-transparent sm:text-[10px] sm:font-normal sm:text-graphite-500",
                  isSameDay(day, new Date()) && "border-sage-600/30 bg-sand-100 text-graphite-900 ring-1 ring-sage-600/20 sm:rounded-t-lg sm:font-semibold",
                )}
              >
                <span>{format(day, "d")}</span>
                <span className="text-[10px] font-medium uppercase text-graphite-500 sm:text-[8px] md:inline">{format(day, "EEEEE", { locale: ru })}</span>
              </div>
            ))}

            {bookingsByRoom.map(({ room, bookings: roomBookings }) => (
              <div key={room.id} className="contents">
                <div className="sticky left-0 z-20 flex min-h-14 w-9 items-center justify-center border-r border-sand-200 bg-white shadow-[8px_0_14px_-14px_rgba(32,33,31,0.45)] sm:min-h-16 sm:w-auto sm:justify-start sm:gap-2 sm:pr-3">
                  <span className={cn("grid h-8 w-8 place-items-center rounded-md text-sm font-semibold text-white sm:h-7 sm:w-7 sm:text-xs", room.accentClass)}>
                    {room.shortName}
                  </span>
                  <div className="hidden min-w-0 sm:block">
                    <div className="truncate text-xs font-semibold text-graphite-900">{room.name}</div>
                    <div className="truncate text-[9px] text-graphite-500 sm:text-[10px]">{roomBookings.length ? `${roomBookings.length} броней` : "свободно"}</div>
                  </div>
                </div>

                <div
                  className="relative min-h-14 overflow-hidden rounded-lg border border-sand-200 bg-white sm:min-h-16 sm:rounded-md"
                  style={{ gridColumn: `2 / span ${visibleDays}` }}
                >
                  <div
                    className="absolute inset-0 grid"
                    style={{ gridTemplateColumns: daysGridColumns }}
                  >
                    {days.map((day) => (
                      <div
                        key={`${room.id}-${day.toISOString()}`}
                        className={cn(
                          "border-r border-sand-100 bg-sand-50/40",
                          isSameDay(day, new Date()) && "bg-sand-100/80",
                        )}
                      />
                    ))}
                  </div>

                  <div
                    className="absolute inset-x-0 top-1/2 grid -translate-y-1/2 px-0.5 sm:px-1"
                    style={{ gridTemplateColumns: bookingGridColumns }}
                  >
                    {roomBookings.map(({ booking, startsBeforeView, endsAfterView, startColumn, span }) => (
                      <button
                        key={booking.id}
                        type="button"
                        className={cn(
                          "group relative z-10 mx-0.5 flex h-8 min-w-0 items-center gap-1 overflow-hidden border px-1.5 text-left text-[10px] font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600 sm:h-9 sm:px-2",
                          startsBeforeView ? "rounded-l-none" : "rounded-l-lg",
                          endsAfterView ? "rounded-r-none" : "rounded-r-lg",
                          statusBarClassName[booking.status],
                        )}
                        style={{ gridColumn: `${startColumn + 1} / span ${span}` }}
                        title={`${booking.guest_name}: ${formatRuDate(booking.check_in)} - ${formatRuDate(booking.check_out)}`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {!startsBeforeView && <LogIn className="hidden h-3 w-3 shrink-0 sm:block" />}
                        <span className="min-w-0 truncate">{booking.guest_name}</span>
                        {span >= 4 && (
                          <span className="ml-auto hidden shrink-0 text-[9px] font-medium opacity-75 lg:inline">
                            {format(parseISO(booking.check_in), "d MMM", { locale: ru })} - {format(parseISO(booking.check_out), "d MMM", { locale: ru })}
                          </span>
                        )}
                        {!endsAfterView && <LogOut className="hidden h-3 w-3 shrink-0 opacity-80 sm:block" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog.Root open={Boolean(selectedBooking)} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-graphite-900/25 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white bg-white p-6 shadow-2xl shadow-stone-900/20">
            {selectedBooking && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-graphite-900">
                      {selectedBooking.guest_name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-graphite-500">
                      {formatRuDate(selectedBooking.check_in)} - {formatRuDate(selectedBooking.check_out)}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close className="rounded-full p-2 text-graphite-500 hover:bg-sand-100">
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>
                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-sand-50 p-3">
                    <span className="text-graphite-500">Объект</span>
                    <span className="font-medium text-graphite-900">
                      {rooms.find((room) => room.id === selectedBooking.room_id)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-sand-50 p-3">
                    <span className="text-graphite-500">Статус</span>
                    <Badge className={statusClassName(selectedBooking.status)}>{statusLabel(selectedBooking.status)}</Badge>
                  </div>
                  {selectedBooking.comment && (
                    <p className="rounded-xl bg-sand-50 p-3 text-graphite-700">{selectedBooking.comment}</p>
                  )}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Card>
  );
}

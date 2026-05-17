import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { dateInputFormat, formatRuDate, todayInputValue } from "@/shared/lib/date";
import { Button } from "@/shared/ui/Button";

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

function getCalendarDays(anchorDate: Date) {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(anchorDate), { weekStartsOn: 1 }),
  });
}

function formatDateRange(checkIn: string, checkOut: string, placeholder: string) {
  if (checkIn && checkOut) {
    return `${formatRuDate(checkIn)} - ${formatRuDate(checkOut)}`;
  }

  if (checkIn) {
    return `${formatRuDate(checkIn)} - выберите выезд`;
  }

  return placeholder;
}

type DateRangePickerProps = {
  id?: string;
  checkIn: string;
  checkOut: string;
  onChange: (value: { checkIn: string; checkOut: string }) => void;
  minDate?: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  summaryClassName?: string;
  getDayLabel?: (date: Date) => string | null;
  getDayTitle?: (date: Date) => string | undefined;
  showSummary?: boolean;
  compact?: boolean;
};

export function DateRangePicker({
  id,
  checkIn,
  checkOut,
  onChange,
  minDate,
  placeholder = "Выберите даты заезда и выезда",
  className,
  triggerClassName,
  panelClassName,
  summaryClassName,
  getDayLabel,
  getDayTitle,
  showSummary = true,
  compact = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(parseISO(checkIn || minDate || todayInputValue())));

  useEffect(() => {
    if (!checkIn) {
      return;
    }

    setCalendarMonth(startOfMonth(parseISO(checkIn)));
  }, [checkIn]);

  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);

  const handleSelect = (selectedDate: Date) => {
    const selectedValue = format(selectedDate, dateInputFormat);

    if (minDate && selectedValue < minDate) {
      return;
    }

    if (!checkIn || checkOut || selectedValue <= checkIn) {
      onChange({ checkIn: selectedValue, checkOut: "" });
      return;
    }

    onChange({ checkIn, checkOut: selectedValue });
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-sand-200 bg-white px-4 text-left text-sm text-graphite-900 shadow-sm outline-none transition hover:border-sage-600/40 focus:border-sage-600 focus:ring-4 focus:ring-sage-600/10",
          triggerClassName,
        )}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={cn("truncate", !checkIn && "text-graphite-500/70")}>{formatDateRange(checkIn, checkOut, placeholder)}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-sage-700" />
      </button>

      {isOpen && (
        <div className={cn("absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-sand-200 bg-white p-3 shadow-xl shadow-graphite-900/10", panelClassName)}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <Button type="button" variant="secondary" size="icon" onClick={() => setCalendarMonth((date) => addMonths(date, -1))} aria-label="Предыдущий месяц">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-semibold capitalize text-graphite-900">{format(calendarMonth, "LLLL yyyy", { locale: ru })}</div>
            <Button type="button" variant="secondary" size="icon" onClick={() => setCalendarMonth((date) => addMonths(date, 1))} aria-label="Следующий месяц">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-graphite-500">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayValue = format(day, dateInputFormat);
              const isCheckIn = checkIn === dayValue;
              const isCheckOut = checkOut === dayValue;
              const isInRange = Boolean(checkIn && checkOut && dayValue > checkIn && dayValue < checkOut);
              const isBeforeMinDate = Boolean(minDate && dayValue < minDate);
              const dayLabel = getDayLabel?.(day);

              return (
                <button
                  key={dayValue}
                  type="button"
                  className={cn(
                    "rounded-xl text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600",
                    compact ? "h-9" : "flex h-12 flex-col items-center justify-center px-1",
                    isBeforeMinDate ? "cursor-not-allowed text-graphite-300" : "text-graphite-800 hover:bg-sand-100",
                    !isSameMonth(day, calendarMonth) && !isBeforeMinDate && "text-graphite-400",
                    isInRange && "bg-sage-50 text-sage-900",
                    (isCheckIn || isCheckOut) && "bg-sage-700 text-white hover:bg-sage-700",
                    isSameDay(day, new Date()) && !isCheckIn && !isCheckOut && !isBeforeMinDate && "ring-1 ring-sage-600/30",
                  )}
                  onClick={() => handleSelect(day)}
                  title={getDayTitle?.(day)}
                  disabled={isBeforeMinDate}
                >
                  <span>{format(day, "d")}</span>
                  {!compact && dayLabel ? (
                    <span
                      className={cn(
                        "text-[10px] font-semibold leading-none",
                        isCheckIn || isCheckOut ? "text-white/90" : "text-graphite-500",
                        !isSameMonth(day, calendarMonth) && !(isCheckIn || isCheckOut) && "text-graphite-400",
                      )}
                    >
                      {dayLabel}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {showSummary ? (
            <div className={cn("mt-3 grid gap-1 rounded-xl bg-sand-50 p-3 text-xs text-graphite-600", compact && "sm:grid-cols-2", summaryClassName)}>
              <span>Заезд: {checkIn ? formatRuDate(checkIn) : "не выбран"}</span>
              <span>Выезд: {checkOut ? formatRuDate(checkOut) : "не выбран"}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

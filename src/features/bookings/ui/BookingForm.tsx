import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { rooms } from "@/entities/room";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, FieldError, Input, Label, NativeSelect, Textarea } from "@/shared/ui/Form";
import { dateInputFormat, formatRuDate, todayInputValue } from "@/shared/lib/date";
import { bookingOverlaps, isCheckoutAfterCheckin } from "../model/validation";
import { bookingStatuses } from "../model/status";
import type { Booking, BookingFormValues } from "../model/types";

type BookingFormProps = {
  bookings: Booking[];
  editingBooking?: Booking | null;
  isSubmitting?: boolean;
  onSubmit: (values: BookingFormValues) => void;
  onCancelEdit?: () => void;
};

const defaultValues: BookingFormValues = {
  room_id: "room-1",
  guest_name: "",
  phone: "",
  check_in: todayInputValue(),
  check_out: "",
  amount: "",
  status: "reserved",
  comment: "",
};

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

function getCalendarDays(anchorDate: Date) {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(anchorDate), { weekStartsOn: 1 }),
  });
}

function formatDateRange(checkIn: string, checkOut: string) {
  if (checkIn && checkOut) {
    return `${formatRuDate(checkIn)} - ${formatRuDate(checkOut)}`;
  }

  if (checkIn) {
    return `${formatRuDate(checkIn)} - выберите выезд`;
  }

  return "Выберите даты заезда и выезда";
}

export function BookingForm({ bookings, editingBooking, isSubmitting, onSubmit, onCancelEdit }: BookingFormProps) {
  const initialValues = useMemo<BookingFormValues>(() => {
    if (!editingBooking) {
      return defaultValues;
    }

    return {
      room_id: editingBooking.room_id,
      guest_name: editingBooking.guest_name,
      phone: editingBooking.phone,
      check_in: editingBooking.check_in,
      check_out: editingBooking.check_out,
      amount: String(editingBooking.amount),
      status: editingBooking.status,
      comment: editingBooking.comment ?? "",
    };
  }, [editingBooking]);

  const [values, setValues] = useState<BookingFormValues>(initialValues);
  const [error, setError] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(parseISO(initialValues.check_in || todayInputValue())));

  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);

  const updateField = <Key extends keyof BookingFormValues>(key: Key, value: BookingFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateDateRange = (selectedDate: Date) => {
    const selectedValue = format(selectedDate, dateInputFormat);

    setValues((current) => {
      if (!current.check_in || current.check_out || selectedValue <= current.check_in) {
        return { ...current, check_in: selectedValue, check_out: "" };
      }

      setIsDatePickerOpen(false);
      return { ...current, check_out: selectedValue };
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!values.guest_name.trim() || !values.phone.trim() || !values.check_in || !values.check_out) {
      setError("Заполните гостя, телефон, дату заезда и дату выезда.");
      return;
    }

    if (!isCheckoutAfterCheckin(values.check_in, values.check_out)) {
      setError("Дата выезда должна быть позже даты заезда.");
      return;
    }

    if (Number.isNaN(Number(values.amount)) || Number(values.amount) < 0) {
      setError("Укажите корректную сумму брони.");
      return;
    }

    if (
      bookingOverlaps(
        { room_id: values.room_id, check_in: values.check_in, check_out: values.check_out },
        bookings,
        editingBooking?.id,
      )
    ) {
      setError("Эти даты пересекаются с другой бронью выбранного объекта.");
      return;
    }

    onSubmit(values);
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-graphite-900">
          {editingBooking ? "Редактировать бронь" : "Новая бронь"}
        </h2>
        <p className="mt-1 text-sm text-graphite-500">Проверка пересечений выполняется перед сохранением.</p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="room_id">Объект</Label>
            <NativeSelect
              id="room_id"
              value={values.room_id}
              onChange={(event) => updateField("room_id", event.target.value as BookingFormValues["room_id"])}
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <Label htmlFor="status">Статус</Label>
            <NativeSelect
              id="status"
              value={values.status}
              onChange={(event) => updateField("status", event.target.value as BookingFormValues["status"])}
            >
              {bookingStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>

        <Field className="relative">
          <Label htmlFor="stay_dates">Даты проживания</Label>
          <button
            id="stay_dates"
            type="button"
            className="flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-sand-200 bg-white px-4 text-left text-sm text-graphite-900 shadow-sm outline-none transition hover:border-sage-600/40 focus:border-sage-600 focus:ring-4 focus:ring-sage-600/10"
            onClick={() => setIsDatePickerOpen((current) => !current)}
          >
            <span className={cn("truncate", !values.check_in && "text-graphite-500/70")}>{formatDateRange(values.check_in, values.check_out)}</span>
            <CalendarDays className="h-4 w-4 shrink-0 text-sage-700" />
          </button>

          {isDatePickerOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-sand-200 bg-white p-3 shadow-xl shadow-graphite-900/10">
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
                  const isCheckIn = values.check_in === dayValue;
                  const isCheckOut = values.check_out === dayValue;
                  const isInRange = Boolean(values.check_in && values.check_out && dayValue > values.check_in && dayValue < values.check_out);

                  return (
                    <button
                      key={dayValue}
                      type="button"
                      className={cn(
                        "h-9 rounded-xl text-sm font-medium text-graphite-800 transition hover:bg-sand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600",
                        !isSameMonth(day, calendarMonth) && "text-graphite-400",
                        isInRange && "bg-sage-50 text-sage-900",
                        (isCheckIn || isCheckOut) && "bg-sage-700 text-white hover:bg-sage-700",
                        isSameDay(day, new Date()) && !isCheckIn && !isCheckOut && "ring-1 ring-sage-600/30",
                      )}
                      onClick={() => updateDateRange(day)}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 grid gap-1 rounded-xl bg-sand-50 p-3 text-xs text-graphite-600 sm:grid-cols-2">
                <span>Заезд: {values.check_in ? formatRuDate(values.check_in) : "не выбран"}</span>
                <span>Выезд: {values.check_out ? formatRuDate(values.check_out) : "не выбран"}</span>
              </div>
            </div>
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="guest_name">Имя гостя</Label>
            <Input id="guest_name" value={values.guest_name} onChange={(event) => updateField("guest_name", event.target.value)} placeholder="Иван Петров" />
          </Field>
          <Field>
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" value={values.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+7 900 000-00-00" />
          </Field>
        </div>

        <Field>
          <Label htmlFor="amount">Сумма брони</Label>
          <Input id="amount" type="number" min="0" step="100" value={values.amount} onChange={(event) => updateField("amount", event.target.value)} placeholder="35000" />
        </Field>

        <Field>
          <Label htmlFor="comment">Комментарий</Label>
          <Textarea id="comment" value={values.comment} onChange={(event) => updateField("comment", event.target.value)} placeholder="Детали заезда, пожелания гостя" />
        </Field>

        <FieldError>{error}</FieldError>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? "Сохранение..." : editingBooking ? "Сохранить изменения" : "Добавить бронь"}
          </Button>
          {editingBooking && (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Отменить
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

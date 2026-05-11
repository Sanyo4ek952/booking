import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft, Banknote, CalendarDays, Check, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { getSelectedAmenityCategories, roomById, type RoomId } from "@/entities/room";
import { formatPrice, getMinimumRoomPrice, getRoomPriceForDate } from "@/features/bookings";
import { cn } from "@/shared/lib/cn";
import { dateInputFormat, formatRuDate, todayInputValue } from "@/shared/lib/date";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, Label } from "@/shared/ui/Form";

function isRoomId(value: string | undefined): value is RoomId {
  return value === "room-1" || value === "room-2" || value === "room-3" || value === "room-4";
}

function calculateStayAmount(roomId: RoomId, checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut || parseISO(checkOut).getTime() <= parseISO(checkIn).getTime()) {
    return { nights: 0, amount: null, hasMissingPrice: false };
  }

  const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  const stayDates = eachDayOfInterval({
    start: parseISO(checkIn),
    end: addDays(parseISO(checkOut), -1),
  });

  const prices = stayDates.map((date) => getRoomPriceForDate(roomId, date));
  const hasMissingPrice = prices.some((price) => price === null);
  const amount = hasMissingPrice ? null : prices.reduce<number>((sum, price) => sum + (price ?? 0), 0);

  return { nights, amount, hasMissingPrice };
}

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

function getDatePickerDays(anchorDate: Date) {
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

export function RoomDetailsPage() {
  const { roomId } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(todayInputValue());
  const [checkOut, setCheckOut] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(parseISO(todayInputValue())));

  if (!isRoomId(roomId)) {
    return <Navigate to="/rooms" replace />;
  }

  const room = roomById.get(roomId);

  if (!room) {
    return <Navigate to="/rooms" replace />;
  }

  const minimumPrice = getMinimumRoomPrice(room.id);
  const gallery = room.gallery.length > 0 ? room.gallery : [room.imageUrl];
  const stay = calculateStayAmount(room.id, checkIn, checkOut);
  const selectedNightPrice = checkIn ? getRoomPriceForDate(room.id, parseISO(checkIn)) : minimumPrice;
  const calendarDays = getDatePickerDays(calendarMonth);
  const selectedAmenityCategories = getSelectedAmenityCategories(room.amenities);

  const updateDateRange = (selectedDate: Date) => {
    const selectedValue = format(selectedDate, dateInputFormat);

    if (!checkIn || checkOut || selectedValue <= checkIn) {
      setCheckIn(selectedValue);
      setCheckOut("");
      return;
    }

    setCheckOut(selectedValue);
    setIsDatePickerOpen(false);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((current) => (current === 0 ? gallery.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current === gallery.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="grid gap-6">
      <Button asChild variant="ghost" className="w-fit px-0 hover:bg-transparent">
        <Link to="/rooms">
          <ArrowLeft className="h-4 w-4" />
          К номерам
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-6">
          <section className="grid gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-sand-100">
              <img src={gallery[activeImageIndex]} alt={room.name} className="aspect-[16/10] w-full object-cover" />

              {gallery.length > 1 && (
                <>
                  <Button type="button" variant="secondary" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2" onClick={showPreviousImage} aria-label="Предыдущее фото">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="secondary" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2" onClick={showNextImage} aria-label="Следующее фото">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`overflow-hidden rounded-xl border-2 bg-sand-100 transition ${
                      index === activeImageIndex ? "border-sage-700" : "border-transparent hover:border-sand-200"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Открыть фото ${index + 1}`}
                  >
                    <img src={image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="grid gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-sage-700">Номер</p>
              <h1 className="mt-2 text-3xl font-semibold text-graphite-900 sm:text-5xl">{room.name}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-graphite-500">{room.fullDescription}</p>
            </div>

            <div className="grid gap-5">
              {selectedAmenityCategories.length > 0 ? (
                selectedAmenityCategories.map((category) => (
                  <div key={category.id} className="grid gap-3">
                    <h2 className="text-xl font-semibold text-graphite-900">{category.title}</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {category.items.map((amenity) => (
                        <div key={amenity.id} className="flex items-center gap-3 rounded-xl bg-white/70 p-3 text-sm font-medium text-graphite-700 shadow-sm shadow-stone-900/5">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sage-700 text-white">
                            <Check className="h-4 w-4" />
                          </span>
                          {amenity.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 rounded-xl bg-white/70 p-3 text-sm font-medium text-graphite-700 shadow-sm shadow-stone-900/5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sage-700 text-white">
                        <Check className="h-4 w-4" />
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card className="grid gap-5 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-semibold text-graphite-900">Расчет проживания</h2>
              <p className="mt-1 text-sm text-graphite-500">Выберите даты заезда и выезда.</p>
            </div>

            <Field className="relative">
              <Label htmlFor="stay-dates">Даты проживания</Label>
              <button
                id="stay-dates"
                type="button"
                className="flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-sand-200 bg-white px-4 text-left text-sm text-graphite-900 shadow-sm outline-none transition hover:border-sage-600/40 focus:border-sage-600 focus:ring-4 focus:ring-sage-600/10"
                onClick={() => setIsDatePickerOpen((current) => !current)}
              >
                <span className="truncate">{formatDateRange(checkIn, checkOut)}</span>
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
                      const isCheckIn = checkIn === dayValue;
                      const isCheckOut = checkOut === dayValue;
                      const isInRange = Boolean(checkIn && checkOut && dayValue > checkIn && dayValue < checkOut);

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

                  <div className="mt-3 grid gap-1 rounded-xl bg-sand-50 p-3 text-xs text-graphite-600">
                    <span>Заезд: {checkIn ? formatRuDate(checkIn) : "не выбран"}</span>
                    <span>Выезд: {checkOut ? formatRuDate(checkOut) : "не выбран"}</span>
                  </div>
                </div>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-sand-50 p-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase text-graphite-500">
                  <Users className="h-4 w-4 text-sage-700" />
                  Гости
                </div>
                <div className="mt-2 text-lg font-semibold text-graphite-900">{room.capacity}</div>
              </div>
              <div className="rounded-xl bg-sand-50 p-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase text-graphite-500">
                  <Banknote className="h-4 w-4 text-sage-700" />
                  Цена
                </div>
                <div className="mt-2 text-lg font-semibold text-graphite-900">{selectedNightPrice ? `${formatPrice(selectedNightPrice)} ₽` : "—"}</div>
                <div className="text-xs text-graphite-500">за ночь</div>
              </div>
            </div>

            <div className="rounded-2xl bg-graphite-900 p-4 text-white">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CalendarDays className="h-4 w-4" />
                {stay.nights > 0 ? `${stay.nights} ночей` : "Даты не выбраны"}
              </div>
              <div className="mt-3 text-3xl font-semibold">
                {stay.amount !== null ? `${formatPrice(stay.amount)} ₽` : "—"}
              </div>
              {stay.hasMissingPrice && (
                <p className="mt-2 text-sm leading-6 text-white/70">Для выбранных дат нет цены в сезонной сетке.</p>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

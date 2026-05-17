import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  ChevronRight,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { rooms } from "@/entities/room";
import { formatPrice, getMinimumRoomPrice, getRoomPriceForDate, useBookings } from "@/features/bookings";
import type { Booking } from "@/features/bookings/model/types";
import { isSupabaseConfigured } from "@/shared/api/supabase";
import { todayInputValue } from "@/shared/lib/date";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { Input, NativeSelect } from "@/shared/ui/Form";

const heroBenefits = [
  { icon: Sparkles, title: "Быстрое бронирование" },
  { icon: ShieldCheck, title: "Без скрытых комиссий" },
];

const footerBenefits = [
  { icon: CalendarDays, title: "Онлайн-бронирование", text: "Мгновенное подтверждение" },
  { icon: Heart, title: "Поддержка 24/7", text: "Мы всегда на связи" },
  { icon: BadgeCheck, title: "Безопасная оплата", text: "Ваши данные защищены" },
  { icon: Sparkles, title: "Лучшие цены", text: "Прямое бронирование" },
];

function formatPublicDate(value: string) {
  return format(parseISO(value), "d MMM yyyy", { locale: ru });
}

function hasOverlap(booking: Booking, checkIn: string, checkOut: string) {
  return booking.check_in < checkOut && booking.check_out > checkIn;
}

export function RoomsPage() {
  const { data: bookings = [], isError, error } = useBookings();
  const today = todayInputValue();
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(() => format(addDays(parseISO(today), 3), "yyyy-MM-dd"));
  const [guests, setGuests] = useState("2");

  const stayNights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    return Math.max(0, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)));
  }, [checkIn, checkOut]);

  const visibleRooms = useMemo(() => {
    return rooms
      .map((room) => {
        const roomBookings = bookings.filter((booking) => booking.room_id === room.id && booking.status !== "checked_out");
        const matchesGuests = Number(guests) <= room.capacity;
        const isAvailable = !checkIn || !checkOut ? true : roomBookings.every((booking) => !hasOverlap(booking, checkIn, checkOut));
        const selectedPrice = checkIn ? getRoomPriceForDate(room.id, parseISO(checkIn)) : getMinimumRoomPrice(room.id);

        return {
          room,
          isAvailable,
          matchesGuests,
          previewImages: room.gallery.slice(0, 5),
          selectedPrice,
        };
      })
      .filter((room) => room.matchesGuests)
      .sort((left, right) => Number(right.isAvailable) - Number(left.isAvailable));
  }, [bookings, checkIn, checkOut, guests]);

  if (!isSupabaseConfigured) {
    return <EnvNotice />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Не удалось загрузить публичную витрину"
        description={error instanceof Error ? error.message : "Проверьте подключение к Supabase и таблицу бронирований."}
      />
    );
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(251,247,240,0.9))] p-5 shadow-xl shadow-stone-900/7 sm:p-8">
        <div className="flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-3 rounded-2xl bg-[#edf7f2] px-4 py-3 text-sage-700">
            <Users className="h-5 w-5" />
            <div>
              <div className="text-2xl font-semibold">LIVE PREVIEW</div>
              <div className="text-sm text-graphite-500">публичная страница для гостей</div>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[28px] border border-sand-200 bg-white/80 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-700 text-white shadow-lg shadow-sage-700/20">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-graphite-900">Гостевой дом</div>
                    <div className="text-sm text-graphite-500">Добро пожаловать</div>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                  <CalendarDays className="h-4 w-4" />
                  Номера
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {heroBenefits.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl bg-sand-50 px-4 py-3 text-sm font-medium text-graphite-700">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-amber-600 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-semibold text-graphite-900 sm:text-5xl">Наши номера</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-graphite-500">
                Выберите номер и забронируйте проживание онлайн. Гость видит только доступные комнаты, фото, описание и цену за ночь.
              </p>
            </div>

            <Card id="prices" className="scroll-mt-32 p-4 sm:p-5">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-graphite-500">Заезд</div>
                  <Input type="date" value={checkIn} min={today} onChange={(event) => setCheckIn(event.target.value)} className="mt-2" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-graphite-500">Выезд</div>
                  <Input type="date" value={checkOut} min={checkIn || today} onChange={(event) => setCheckOut(event.target.value)} className="mt-2" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-graphite-500">Гости</div>
                  <NativeSelect value={guests} onChange={(event) => setGuests(event.target.value)} className="mt-2">
                    <option value="1">1 гость</option>
                    <option value="2">2 гостя</option>
                    <option value="3">3 гостя</option>
                    <option value="4">4 гостя</option>
                  </NativeSelect>
                </div>
                <div className="flex items-end">
                  <Button type="button" className="w-full">
                    Найти номера
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        {visibleRooms.map(({ room, isAvailable, previewImages, selectedPrice }) => (
          <Card key={room.id} className="overflow-hidden p-4 sm:p-5">
            <div className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
              <div className="grid gap-3">
                <div className="overflow-hidden rounded-2xl bg-sand-100">
                  <img src={room.imageUrl} alt={room.name} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {previewImages.map((image) => (
                    <div key={image} className="overflow-hidden rounded-xl bg-sand-100">
                      <img src={image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-graphite-900">{room.name}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isAvailable ? "bg-[#edf7f2] text-sage-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isAvailable ? "Свободен" : "Есть пересечение"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-graphite-500">
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        до {room.capacity} гостей
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {stayNights > 0 ? `${stayNights} ночи` : "выберите даты"}
                      </span>
                    </div>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-graphite-500">{room.description}</p>
                  </div>

                  <button
                    type="button"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sand-200 bg-white text-graphite-500 transition hover:border-sand-300 hover:text-graphite-900"
                    aria-label={`Добавить ${room.name} в избранное`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 4).map((amenity) => (
                    <span key={amenity} className="rounded-full border border-sand-200 bg-sand-50 px-3 py-2 text-sm text-graphite-600">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-4 border-t border-sand-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-graphite-500">
                      <Banknote className="h-4 w-4 text-sage-700" />
                      {checkIn ? `Цена на ${formatPublicDate(checkIn)}` : "Цена за ночь"}
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-graphite-900">
                      {selectedPrice ? `${formatPrice(selectedPrice)} ₽` : "—"}
                      <span className="ml-2 text-base font-medium text-graphite-500">/ ночь</span>
                    </div>
                  </div>

                  <Button asChild className="sm:min-w-44">
                    <Link to={`/rooms/${room.id}`}>
                      {isAvailable ? "Выбрать даты" : "Посмотреть номер"}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-lg shadow-stone-900/5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {footerBenefits.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sand-50 text-sage-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold text-graphite-900">{title}</div>
              <div className="text-sm text-graphite-500">{text}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

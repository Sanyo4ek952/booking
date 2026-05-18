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
import * as Dialog from "@radix-ui/react-dialog";
import { ru } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Banknote, BedDouble, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router";
import { getSelectedAmenityCategories, roomById, type RoomId } from "@/entities/room";
import { formatPrice, getMinimumRoomPrice, getRoomPriceForDate, useBookings } from "@/features/bookings";
import { bookingOverlaps, isCheckoutAfterCheckin } from "@/features/bookings/model/validation";
import { createBookingRequest } from "@/shared/api/bookingRequests";
import { cn } from "@/shared/lib/cn";
import { dateInputFormat, formatRuDate, todayInputValue } from "@/shared/lib/date";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, FieldError, Input, Label, NativeSelect, Textarea } from "@/shared/ui/Form";
import { useToast } from "@/shared/ui/useToast";

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

function formatGuestOptionLabel(value: number) {
  if (value === 1) {
    return "1 гость";
  }

  if (value >= 2 && value <= 4) {
    return `${value} гостя`;
  }

  return `${value} гостей`;
}

type DetailAccordionSection = {
  id: string;
  title: string;
  icon: "bed" | "check";
  items: Array<{ id: string; label: string }>;
};

export function RoomDetailsPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { data: bookings = [] } = useBookings();
  const room = isRoomId(roomId) ? roomById.get(roomId) ?? null : null;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(() => searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(() => searchParams.get("checkOut") ?? "");
  const [guests, setGuests] = useState(() => searchParams.get("guests") ?? "2");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [openDetailSectionId, setOpenDetailSectionId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(parseISO(todayInputValue())));
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const minimumPrice = room ? getMinimumRoomPrice(room.id) : null;
  const gallery = room ? (room.gallery.length > 0 ? room.gallery : [room.imageUrl]) : [];
  const stay = room ? calculateStayAmount(room.id, checkIn, checkOut) : { nights: 0, amount: null, hasMissingPrice: false };
  const selectedNightPrice = room && checkIn ? getRoomPriceForDate(room.id, parseISO(checkIn)) : minimumPrice;
  const calendarDays = getDatePickerDays(calendarMonth);
  const roomBookings = useMemo(
    () => (room ? bookings.filter((booking) => booking.room_id === room.id && booking.status !== "checked_out") : []),
    [bookings, room],
  );
  const selectedAmenityCategories = room ? getSelectedAmenityCategories(room.amenities) : [];
  const hasCustomDetailSections = Boolean(room?.detailSections && room.detailSections.length > 0);
  const detailAccordionSections = useMemo<DetailAccordionSection[]>(() => {
    if (!room) {
      return [];
    }

    const sections: DetailAccordionSection[] = [];

    if (room.sleepingPlaces && room.sleepingPlaces.length > 0) {
      sections.push({
        id: "sleeping-places",
        title: "РЎРїР°Р»СЊРЅС‹Рµ РјРµСЃС‚Р°",
        icon: "bed",
        items: room.sleepingPlaces.map((item) => ({
          id: item.id,
          label: `${item.quantity} x ${item.label}`,
        })),
      });
    }

    if (hasCustomDetailSections && room.detailSections) {
      sections.push(
        ...room.detailSections.map((section) => ({
          id: section.id,
          title: section.title,
          icon: "check" as const,
          items: section.items.map((item, index) => ({
            id: `${section.id}-${index}`,
            label: item,
          })),
        })),
      );
      return sections;
    }

    if (selectedAmenityCategories.length > 0) {
      sections.push(
        ...selectedAmenityCategories.map((category) => ({
          id: category.id,
          title: category.title,
          icon: "check" as const,
          items: category.items.map((amenity) => ({
            id: amenity.id,
            label: amenity.label,
          })),
        })),
      );
      return sections;
    }

    if (room.amenities.length > 0) {
      sections.push({
        id: "amenities",
        title: "РЈРґРѕР±СЃС‚РІР°",
        icon: "check",
        items: room.amenities.map((amenity, index) => ({
          id: `amenity-${index}`,
          label: amenity,
        })),
      });
    }

    return sections;
  }, [hasCustomDetailSections, room, selectedAmenityCategories]);
  const normalizedDetailAccordionSections = useMemo(
    () =>
      detailAccordionSections.map((section) => {
        if (section.id === "sleeping-places") {
          return { ...section, title: "\u0421\u043f\u0430\u043b\u044c\u043d\u044b\u0435 \u043c\u0435\u0441\u0442\u0430" };
        }

        if (section.id === "amenities") {
          return { ...section, title: "\u0423\u0434\u043e\u0431\u0441\u0442\u0432\u0430" };
        }

        return section;
      }),
    [detailAccordionSections],
  );
  const guestOptions = Array.from({ length: room?.capacity ?? 1 }, (_, index) => ({
    value: String(index + 1),
    label: formatGuestOptionLabel(index + 1),
  }));
  const bookingRequestMutation = useMutation({
    mutationFn: createBookingRequest,
  });

  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[activeImageIndex];

    activeThumbnail?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeImageIndex]);

  useEffect(() => {
    if (openDetailSectionId && !normalizedDetailAccordionSections.some((section) => section.id === openDetailSectionId)) {
      setOpenDetailSectionId(null);
    }
  }, [normalizedDetailAccordionSections, openDetailSectionId]);

  const isCalendarDayBooked = (day: Date) =>
    roomBookings.some((booking) => {
      const checkInDate = parseISO(booking.check_in);
      const checkOutDate = parseISO(booking.check_out);

      return checkInDate <= day && checkOutDate > day;
    });

  const isCalendarDayDisabled = (day: Date, context: { checkIn: string; checkOut: string }) => {
    if (!room) {
      return true;
    }

    const dayValue = format(day, dateInputFormat);

    if (!context.checkIn || context.checkOut || dayValue <= context.checkIn) {
      return isCalendarDayBooked(day);
    }

    return bookingOverlaps(
      {
        room_id: room.id,
        check_in: context.checkIn,
        check_out: dayValue,
      },
      roomBookings,
    );
  };

  const isCheckoutOptionBlocked = (day: Date, context: { checkIn: string; checkOut: string }) => {
    if (!context.checkIn || context.checkOut) {
      return false;
    }

    return !isCalendarDayBooked(day) && isCalendarDayDisabled(day, context);
  };

  const updateDateRange = (selectedDate: Date) => {
    const selectedValue = format(selectedDate, dateInputFormat);
    const isUnavailable = isCalendarDayDisabled(selectedDate, { checkIn, checkOut });
    const canRestartSelection = Boolean(isUnavailable && checkIn && !checkOut && selectedValue > checkIn);

    setFormError("");

    if (isUnavailable) {
      if (canRestartSelection) {
        setCheckIn(selectedValue);
        setCheckOut("");
      }
      return;
    }

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

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!room) {
      setFormError("Не удалось определить объект для заявки.");
      return;
    }

    if (!guestName.trim() || !phone.trim()) {
      setFormError("Укажите имя и телефон для связи.");
      return;
    }

    if (!checkIn || !checkOut || !isCheckoutAfterCheckin(checkIn, checkOut)) {
      setFormError("Выберите корректные даты заезда и выезда.");
      return;
    }

    try {
      const result = await bookingRequestMutation.mutateAsync({
        room_id: room.id,
        room_name: room.name,
        guests: Number(guests),
        guest_name: guestName.trim(),
        phone: phone.trim(),
        check_in: checkIn,
        check_out: checkOut,
        nights: stay.nights,
        amount: stay.amount,
        nightly_price: selectedNightPrice,
        comment: comment.trim(),
        source: "website",
      });

      const message = "Заявка отправлена. Мы проверим даты и свяжемся с вами.";
      setGuestName("");
      setPhone("");
      setComment("");
      setIsRequestModalOpen(false);

      toast({
        title: message,
        description: result.telegram_sent ? undefined : "Заявка сохранена, но уведомление в Telegram требует проверки на стороне сервера.",
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Не удалось отправить заявку.";
      setFormError(description);
      toast({
        title: "Не удалось отправить заявку",
        description,
        variant: "error",
      });
    }
  };

  if (!room) {
    return <Navigate to="/rooms" replace />;
  }

  return (
    <div className="grid gap-6">
      <Button asChild variant="ghost" className="w-fit px-0 hover:bg-transparent">
        <Link to="/rooms">
          <ArrowLeft className="h-4 w-4" />
          К номерам
        </Link>
      </Button>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start sm:gap-6">
        <div className="grid min-w-0 gap-4 sm:gap-6">
          <section className="grid min-w-0 gap-2 sm:gap-4">
            <div className="relative w-full overflow-hidden rounded-xl bg-sand-100 sm:rounded-2xl">
              <img
                src={gallery[activeImageIndex]}
                alt={room.name}
                className="aspect-[4/3] max-h-[42svh] w-full object-cover object-center sm:aspect-[16/10] sm:max-h-none"
              />

              {gallery.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 sm:left-4 sm:h-10 sm:w-10"
                    onClick={showPreviousImage}
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 sm:right-4 sm:h-10 sm:w-10"
                    onClick={showNextImage}
                    aria-label="Следующее фото"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="relative hidden sm:block">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[rgba(251,247,240,0.95)] to-transparent sm:w-8" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[rgba(251,247,240,0.95)] to-transparent sm:w-8" />
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {gallery.map((image, index) => (
                    <button
                      key={image}
                      ref={(element) => {
                        thumbnailRefs.current[index] = element;
                      }}
                      type="button"
                      className={`aspect-[4/3] w-32 shrink-0 snap-center overflow-hidden rounded-xl border-2 bg-sand-100 transition ${
                        index === activeImageIndex ? "border-sage-700" : "border-transparent hover:border-sand-200"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Открыть фото ${index + 1}`}
                      aria-pressed={index === activeImageIndex}
                    >
                      <img src={image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="grid min-w-0 gap-5 rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(251,247,240,0.92))] p-5 shadow-xl shadow-stone-900/6 sm:p-7">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg ${room.accentClass}`}>
                    <BedDouble className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h1 className="break-words text-3xl font-semibold text-graphite-900 sm:text-4xl">{room.name}</h1>
                    <p className="text-sm text-graphite-500">Подробности и условия проживания</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-graphite-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2">
                    <Users className="h-4 w-4 text-sage-700" />
                    До {room.capacity} гостей
                  </span>
                  {room.sleepingPlacesSummary ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2">
                      <BedDouble className="h-4 w-4 text-sage-700" />
                      {room.sleepingPlacesSummary}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="shrink-0 rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm sm:text-right">
                <div className="text-sm text-graphite-500">От</div>
                <div className="text-2xl font-semibold text-graphite-900">
                  {minimumPrice ? `${formatPrice(minimumPrice)} ₽` : "—"}
                </div>
                <div className="text-xs text-graphite-500">за ночь</div>
              </div>
            </div>

            <p className="max-w-3xl text-base leading-7 text-graphite-600">{room.fullDescription}</p>

            {normalizedDetailAccordionSections.length > 0 ? (
              <div className="grid gap-3">
                {normalizedDetailAccordionSections.map((section) => {
                  const isOpen = openDetailSectionId === section.id;

                  return (
                    <div
                      key={section.id}
                      className={cn(
                        "overflow-hidden rounded-[24px] border border-white/80 bg-white/55 shadow-sm shadow-stone-900/5 transition-[background-color,box-shadow,border-color] duration-300 ease-out",
                        isOpen && "bg-white/72 shadow-md shadow-stone-900/8",
                      )}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-300 ease-out hover:bg-white/35 sm:px-5"
                        onClick={() => setOpenDetailSectionId((current) => (current === section.id ? null : section.id))}
                        aria-expanded={isOpen}
                        aria-controls={`room-detail-section-${section.id}`}
                      >
                        <span className="text-xl font-semibold text-graphite-900">{section.title}</span>
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand-100 text-graphite-600 transition-colors duration-300 ease-out",
                            isOpen && "bg-sage-100 text-sage-700",
                          )}
                        >
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300 ease-out", isOpen && "rotate-180")} />
                        </span>
                      </button>

                      <div
                        id={`room-detail-section-${section.id}`}
                        className={cn(
                          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="min-h-0">
                          <div
                            className={cn(
                              "border-t border-white/80 px-4 pt-4 transition-[padding,transform] duration-300 ease-out sm:px-5",
                              isOpen ? "translate-y-0 pb-4 sm:pb-5" : "-translate-y-1 pb-0",
                            )}
                          >
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {section.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white/70 p-3 text-sm font-medium text-graphite-700 shadow-sm shadow-stone-900/5">
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sage-700 text-white">
                                  {section.icon === "bed" ? <BedDouble className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                </span>
                                {item.label}
                              </div>
                            ))}
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {false && room?.sleepingPlaces?.length ? (
              <div className="grid gap-3">
                <h2 className="text-xl font-semibold text-graphite-900">Спальные места</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {room!.sleepingPlaces!.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white/70 p-3 text-sm font-medium text-graphite-700 shadow-sm shadow-stone-900/5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sage-700 text-white">
                        <BedDouble className="h-4 w-4" />
                      </span>
                      {item.quantity} x {item.label}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="hidden">
              {hasCustomDetailSections && room.detailSections ? (
                room.detailSections.map((section) => (
                  <div key={section.id} className="grid gap-3">
                    <h2 className="text-xl font-semibold text-graphite-900">{section.title}</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {section.items.map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-xl bg-white/70 p-3 text-sm font-medium text-graphite-700 shadow-sm shadow-stone-900/5">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sage-700 text-white">
                            <Check className="h-4 w-4" />
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : selectedAmenityCategories.length > 0 ? (
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

        <aside className="min-w-0 lg:sticky lg:top-24">
          <Card className="grid min-w-0 gap-5 p-4 sm:p-6">
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
                <div className="absolute left-0 right-0 top-full z-20 mt-2 w-full max-w-full overflow-hidden rounded-2xl border border-sand-200 bg-white p-3 shadow-xl shadow-graphite-900/10">
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
                      const dayPrice = getRoomPriceForDate(room.id, day);
                      const isCheckIn = checkIn === dayValue;
                      const isCheckOut = checkOut === dayValue;
                      const isInRange = Boolean(checkIn && checkOut && dayValue > checkIn && dayValue < checkOut);
                      const isBooked = isCalendarDayBooked(day);
                      const isDisabled = isCalendarDayDisabled(day, { checkIn, checkOut });
                      const isCheckoutBlocked = isCheckoutOptionBlocked(day, { checkIn, checkOut });
                      const canRestartSelection = Boolean(isDisabled && checkIn && !checkOut && dayValue > checkIn);

                      return (
                        <button
                          key={dayValue}
                          type="button"
                          className={cn(
                            "flex h-12 flex-col items-center justify-center rounded-xl px-1 text-sm font-medium text-graphite-800 transition hover:bg-sand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600",
                            isDisabled && !canRestartSelection && "cursor-not-allowed",
                            isBooked && "bg-red-50 text-red-700 hover:bg-red-50",
                            isCheckoutBlocked && "bg-sand-100 text-graphite-500 hover:bg-sand-100",
                            !isSameMonth(day, calendarMonth) && !isDisabled && "text-graphite-400",
                            isInRange && "bg-sage-50 text-sage-900",
                            (isCheckIn || isCheckOut) && "bg-sage-700 text-white hover:bg-sage-700",
                            isSameDay(day, new Date()) && !isCheckIn && !isCheckOut && !isDisabled && "ring-1 ring-sage-600/30",
                          )}
                          onClick={() => updateDateRange(day)}
                          title={
                            isBooked
                              ? "Дата уже занята"
                              : isCheckoutBlocked
                                ? "Недоступно для выбранной даты заезда"
                                : dayPrice
                                  ? `${formatPrice(dayPrice)} ₽ за ночь`
                                  : undefined
                          }
                          disabled={isDisabled && !canRestartSelection}
                        >
                          <span>{format(day, "d")}</span>
                          {isBooked ? (
                            <span className="text-[10px] font-semibold leading-none text-red-700">занято</span>
                          ) : isCheckoutBlocked ? (
                            <span className="text-[10px] font-semibold leading-none text-graphite-500">нельзя</span>
                          ) : dayPrice ? (
                            <span
                              className={cn(
                                "text-[10px] font-semibold leading-none",
                                isCheckIn || isCheckOut ? "text-white/90" : "text-graphite-500",
                                !isSameMonth(day, calendarMonth) && !(isCheckIn || isCheckOut) && "text-graphite-400",
                              )}
                            >
                              {formatPrice(dayPrice)}
                            </span>
                          ) : null}
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
              <div className="mt-3 text-3xl font-semibold">{stay.amount !== null ? `${formatPrice(stay.amount)} ₽` : "—"}</div>
              {stay.hasMissingPrice && (
                <p className="mt-2 text-sm leading-6 text-white/70">Для выбранных дат нет цены в сезонной сетке.</p>
              )}
            </div>

            <div className="rounded-2xl border border-sand-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(247,239,228,0.9))] p-4 shadow-sm shadow-stone-900/5">
              <h3 className="text-lg font-semibold text-graphite-900">Оставить заявку</h3>
              <p className="mt-1 text-sm leading-6 text-graphite-500">
                Откроем красивую модалку с формой, где можно подтвердить даты и оставить контакты.
              </p>
              <Button type="button" className="mt-4 w-full" onClick={() => setIsRequestModalOpen(true)}>
                Оставить заявку
              </Button>
            </div>

            <Dialog.Root open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-graphite-900/25 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,560px)] max-h-[calc(100vh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,246,239,0.96))] p-5 shadow-2xl shadow-stone-900/20 sm:p-6">
                  <form id="booking-request-form" method="post" className="grid gap-4" onSubmit={handleRequestSubmit}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Dialog.Title className="text-2xl font-semibold text-graphite-900">Оставить заявку</Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm leading-6 text-graphite-500">
                          Подтвердите даты, заполните контакты, и мы отправим заявку владельцу.
                        </Dialog.Description>
                      </div>
                      <Dialog.Close asChild>
                        <button type="button" className="rounded-full p-2 text-graphite-500 transition hover:bg-sand-100" aria-label="Закрыть">
                          <X className="h-5 w-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="grid gap-3 rounded-2xl bg-white/80 p-4 shadow-sm shadow-stone-900/5 sm:grid-cols-3">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.12em] text-graphite-500">Даты</div>
                        <div className="mt-2 text-sm font-semibold text-graphite-900">{formatDateRange(checkIn, checkOut)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.12em] text-graphite-500">Гости</div>
                        <div className="mt-2 text-sm font-semibold text-graphite-900">{guests}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.12em] text-graphite-500">Стоимость</div>
                        <div className="mt-2 text-sm font-semibold text-graphite-900">
                          {stay.amount !== null ? `${formatPrice(stay.amount)} ₽` : "Уточним по запросу"}
                        </div>
                      </div>
                    </div>

                    <Field>
                      <Label htmlFor="request-guests">Гости</Label>
                      <NativeSelect id="request-guests" value={guests} onChange={(event) => setGuests(event.target.value)}>
                        {guestOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </NativeSelect>
                    </Field>

                    <Field>
                      <Label htmlFor="request-guest-name">Имя</Label>
                      <Input id="request-guest-name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Иван Петров" />
                    </Field>

                    <Field>
                      <Label htmlFor="request-phone">Телефон</Label>
                      <Input id="request-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 900 000-00-00" />
                    </Field>

                    <Field>
                      <Label htmlFor="request-comment">Комментарий</Label>
                      <Textarea
                        id="request-comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Пожелания по заезду, время приезда, состав гостей"
                      />
                    </Field>

                    <FieldError>{formError}</FieldError>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <Dialog.Close asChild>
                        <Button type="button" variant="secondary" className="sm:min-w-32">
                          Отмена
                        </Button>
                      </Dialog.Close>
                      <Button form="booking-request-form" type="submit" disabled={bookingRequestMutation.isPending} className="sm:min-w-40">
                        {bookingRequestMutation.isPending ? "Отправляем заявку..." : "Отправить заявку"}
                      </Button>
                    </div>

                    <p className="text-xs leading-5 text-graphite-500">
                      После отправки мы сохраним заявку и свяжемся с вами по указанному телефону.
                    </p>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </Card>
        </aside>
      </div>
    </div>
  );
}

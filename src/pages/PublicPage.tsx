import { ArrowRight, BedDouble, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { rooms } from "@/entities/room";
import { BookingCalendar, useBookings } from "@/features/bookings";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { isSupabaseConfigured } from "@/shared/api/supabase";

export function PublicPage() {
  const { data: bookings = [], isLoading, isError, error } = useBookings();

  return (
    <div className="grid gap-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-3 py-1.5 text-sm font-medium text-sage-700 shadow-sm">
            <Clock3 className="h-4 w-4" />
            Обновление календаря в реальном времени
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-graphite-900 sm:text-5xl lg:text-6xl">
            График заселения мини-отеля
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-graphite-500 sm:text-lg">
            Проверьте свободные даты по каждому из четырех объектов. Брони показаны отдельными полосами,
            чтобы было видно заезд, выезд и промежутки между гостями.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/admin">
                Управлять бронями
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <BedDouble className="h-5 w-5 text-sage-700" />
              <span className="text-sm font-semibold text-graphite-900">4 объекта</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-500">Каждый объект ведется отдельно, пересечения дат не допускаются.</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-sage-700" />
              <span className="text-sm font-semibold text-graphite-900">Публичный просмотр</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-500">Гости видят занятость, но не получают кнопок редактирования.</p>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-5">
            <span className={`block h-1.5 w-14 rounded-full ${room.accentClass}`} />
            <h3 className="mt-4 text-lg font-semibold text-graphite-900">{room.name}</h3>
            <p className="mt-2 text-sm leading-6 text-graphite-500">{room.description}</p>
          </Card>
        ))}
      </section>

      {!isSupabaseConfigured ? (
        <EnvNotice />
      ) : isError ? (
        <EmptyState title="Не удалось загрузить брони" description={error instanceof Error ? error.message : "Проверьте настройки Supabase и RLS-политики."} />
      ) : (
        <BookingCalendar bookings={bookings} isLoading={isLoading} />
      )}
    </div>
  );
}

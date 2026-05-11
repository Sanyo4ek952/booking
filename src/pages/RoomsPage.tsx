import { Banknote, CalendarDays, Users } from "lucide-react";
import { Link } from "react-router";
import { rooms } from "@/entities/room";
import { formatPrice, getMinimumRoomPrice } from "@/features/bookings";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

export function RoomsPage() {
  return (
    <div className="grid gap-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sage-700">Номера</p>
          <h1 className="mt-2 text-3xl font-semibold text-graphite-900 sm:text-5xl">Комнаты для проживания</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-graphite-500">
            Выберите подходящий номер по вместимости, фото и цене за ночь.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link to="/">
            <CalendarDays className="h-4 w-4" />
            Календарь занятости
          </Link>
        </Button>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room) => {
          const minimumPrice = getMinimumRoomPrice(room.id);

          return (
            <Card key={room.id} className="relative overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10">
              <div className="relative aspect-[4/3] bg-sand-100">
                <img src={room.imageUrl} alt={room.name} className="h-full w-full object-cover" loading="lazy" />
                <span className={`absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-sm font-semibold text-white shadow-lg shadow-stone-900/20 ${room.accentClass}`}>
                  {room.shortName}
                </span>
              </div>

              <div className="grid gap-4 p-4">
                <div>
                  <h2 className="text-xl font-semibold text-graphite-900">
                    <Link to={`/rooms/${room.id}`} className="after:absolute after:inset-0">
                      {room.name}
                    </Link>
                  </h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-graphite-500">{room.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-sand-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase text-graphite-500">
                      <Banknote className="h-4 w-4 text-sage-700" />
                      От
                    </div>
                    <div className="mt-2 text-base font-semibold text-graphite-900">
                      {minimumPrice ? `${formatPrice(minimumPrice)} ₽` : "—"}
                    </div>
                    <div className="text-xs text-graphite-500">за ночь</div>
                  </div>

                  <div className="rounded-lg bg-sand-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase text-graphite-500">
                      <Users className="h-4 w-4 text-sage-700" />
                      Гости
                    </div>
                    <div className="mt-2 text-base font-semibold text-graphite-900">{room.capacity}</div>
                    <div className="text-xs text-graphite-500">чел.</div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

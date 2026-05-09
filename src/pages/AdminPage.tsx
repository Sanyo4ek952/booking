import * as Dialog from "@radix-ui/react-dialog";
import { Filter, RefreshCw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { rooms, type RoomId } from "@/entities/room";
import {
  BookingForm,
  BookingsTable,
  useBookings,
  useCreateBooking,
  useDeleteBooking,
  useUpdateBooking,
  type Booking,
  type BookingFormValues,
  type BookingStatus,
} from "@/features/bookings";
import { bookingStatuses } from "@/features/bookings/model/status";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { NativeSelect } from "@/shared/ui/Form";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useToast } from "@/shared/ui/useToast";
import { isSupabaseConfigured } from "@/shared/api/supabase";

type RoomFilter = "all" | RoomId;
type StatusFilter = "all" | BookingStatus;
type StatsModal = "total" | "active" | "amount";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function AdminPage() {
  const { toast } = useToast();
  const { data: bookings = [], isLoading, isError, error, refetch, isFetching } = useBookings();
  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();
  const deleteMutation = useDeleteBooking();
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [statsModal, setStatsModal] = useState<StatsModal | null>(null);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const roomMatches = roomFilter === "all" || booking.room_id === roomFilter;
        const statusMatches = statusFilter === "all" || booking.status === statusFilter;

        return roomMatches && statusMatches;
      }),
    [bookings, roomFilter, statusFilter],
  );

  const handleSubmit = async (values: BookingFormValues) => {
    try {
      if (editingBooking) {
        await updateMutation.mutateAsync({ id: editingBooking.id, values });
        setEditingBooking(null);
        toast({ title: "Бронь обновлена", description: "Изменения сохранены в Supabase." });
      } else {
        await createMutation.mutateAsync(values);
        setFormVersion((version) => version + 1);
        toast({ title: "Бронь создана", description: "Новая бронь появилась в календаре." });
      }
    } catch (mutationError) {
      toast({
        title: "Ошибка сохранения",
        description: mutationError instanceof Error ? mutationError.message : "Supabase вернул ошибку.",
        variant: "error",
      });
    }
  };

  const handleDelete = async (booking: Booking) => {
    const confirmed = window.confirm(`Удалить бронь гостя ${booking.guest_name}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(booking.id);
      if (editingBooking?.id === booking.id) {
        setEditingBooking(null);
      }
      toast({ title: "Бронь удалена", description: "Календарь обновится автоматически." });
    } catch (mutationError) {
      toast({
        title: "Ошибка удаления",
        description: mutationError instanceof Error ? mutationError.message : "Supabase вернул ошибку.",
        variant: "error",
      });
    }
  };

  const roomStats = useMemo(
    () =>
      rooms.map((room) => {
        const roomBookings = bookings.filter((booking) => booking.room_id === room.id);
        const activeRoomBookings = roomBookings.filter((booking) => booking.status !== "checked_out");

        return {
          room,
          totalBookings: roomBookings.length,
          activeBookings: activeRoomBookings.length,
          amount: roomBookings.reduce((sum, booking) => sum + Number(booking.amount), 0),
        };
      }),
    [bookings],
  );

  const totalAmount = roomStats.reduce((sum, stat) => sum + stat.amount, 0);
  const activeBookings = roomStats.reduce((sum, stat) => sum + stat.activeBookings, 0);
  const statsModalTitle =
    statsModal === "total"
      ? "Всего броней по номерам"
      : statsModal === "active"
        ? "Активные брони по номерам"
        : "Сумма по номерам";

  return (
    <div className="grid gap-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sage-700">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-graphite-900 sm:text-5xl">Управление бронями</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-graphite-500">
            Добавляйте заезды, меняйте статусы и контролируйте пересечения по каждому объекту.
          </p>
        </div>
        <Button variant="secondary" onClick={() => refetch()} disabled={!isSupabaseConfigured || isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Обновить
        </Button>
      </section>

      {!isSupabaseConfigured ? (
        <EnvNotice />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-graphite-500">Всего броней</div>
                  <div className="mt-2 text-3xl font-semibold text-graphite-900">{bookings.length}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setStatsModal("total")}>
                  Подробнее
                </Button>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-graphite-500">Активные</div>
                  <div className="mt-2 text-3xl font-semibold text-graphite-900">{activeBookings}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setStatsModal("active")}>
                  Подробнее
                </Button>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-graphite-500">Сумма</div>
                  <div className="mt-2 text-3xl font-semibold text-graphite-900">{currencyFormatter.format(totalAmount)}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setStatsModal("amount")}>
                  Подробнее
                </Button>
              </div>
            </Card>
          </section>

          {isError && (
            <Card className="border-red-200 bg-red-50 p-5 text-sm text-red-800">
              {error instanceof Error ? error.message : "Не удалось загрузить брони."}
            </Card>
          )}

          <section className="grid gap-6">
            <BookingForm
              key={`${editingBooking?.id ?? "new"}-${formVersion}`}
              bookings={bookings}
              editingBooking={editingBooking}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingBooking(null)}
            />

            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-graphite-900">
                    <Filter className="h-4 w-4 text-sage-700" />
                    Фильтры
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 md:w-[460px]">
                    <NativeSelect value={roomFilter} onChange={(event) => setRoomFilter(event.target.value as RoomFilter)}>
                      <option value="all">Все объекты</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </NativeSelect>
                    <NativeSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
                      <option value="all">Все статусы</option>
                      {bookingStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>
                </div>
              </Card>

              {isLoading ? (
                <div className="grid gap-3">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              ) : (
                <BookingsTable bookings={filteredBookings} onEdit={setEditingBooking} onDelete={handleDelete} />
              )}
            </div>
          </section>

          <Dialog.Root open={Boolean(statsModal)} onOpenChange={(open) => !open && setStatsModal(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-graphite-900/25 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white bg-white p-6 shadow-2xl shadow-stone-900/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-graphite-900">{statsModalTitle}</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-graphite-500">
                      Детализация текущих броней по каждому номеру.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close className="rounded-full p-2 text-graphite-500 hover:bg-sand-100" aria-label="Закрыть">
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>

                <div className="mt-5 grid gap-3">
                  {roomStats.map((stat) => (
                    <div key={stat.room.id} className="flex items-center justify-between gap-4 rounded-xl bg-sand-50 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md text-sm font-semibold text-white ${stat.room.accentClass}`}>
                          {stat.room.shortName}
                        </span>
                        <span className="truncate text-sm font-medium text-graphite-900">{stat.room.name}</span>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-graphite-900">
                        {statsModal === "amount"
                          ? currencyFormatter.format(stat.amount)
                          : `${statsModal === "active" ? stat.activeBookings : stat.totalBookings} броней`}
                      </span>
                    </div>
                  ))}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      )}
    </div>
  );
}

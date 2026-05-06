import { Filter, RefreshCw } from "lucide-react";
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

  const totalAmount = bookings.reduce((sum, booking) => sum + Number(booking.amount), 0);
  const activeBookings = bookings.filter((booking) => booking.status !== "checked_out").length;

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
              <div className="text-sm text-graphite-500">Всего броней</div>
              <div className="mt-2 text-3xl font-semibold text-graphite-900">{bookings.length}</div>
            </Card>
            <Card className="p-5">
              <div className="text-sm text-graphite-500">Активные</div>
              <div className="mt-2 text-3xl font-semibold text-graphite-900">{activeBookings}</div>
            </Card>
            <Card className="p-5">
              <div className="text-sm text-graphite-500">Сумма</div>
              <div className="mt-2 text-3xl font-semibold text-graphite-900">
                {new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(totalAmount)}
              </div>
            </Card>
          </section>

          {isError && (
            <Card className="border-red-200 bg-red-50 p-5 text-sm text-red-800">
              {error instanceof Error ? error.message : "Не удалось загрузить брони."}
            </Card>
          )}

          <section className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
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
        </>
      )}
    </div>
  );
}

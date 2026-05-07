import { BookingCalendar, useBookings } from "@/features/bookings";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { isSupabaseConfigured } from "@/shared/api/supabase";

export function PublicPage() {
  const { data: bookings = [], isLoading, isError, error } = useBookings();

  return (
    <div>
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

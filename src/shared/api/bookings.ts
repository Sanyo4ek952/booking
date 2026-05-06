import { supabase } from "./supabase";
import type { Booking, BookingFormValues } from "@/features/bookings/model/types";

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase не настроен. Заполните VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
}

function toPayload(values: BookingFormValues) {
  return {
    room_id: values.room_id,
    guest_name: values.guest_name.trim(),
    phone: values.phone.trim(),
    check_in: values.check_in,
    check_out: values.check_out,
    amount: Number(values.amount),
    status: values.status,
    comment: values.comment.trim() || null,
  };
}

export async function fetchBookings() {
  const { data, error } = await requireSupabase()
    .from("bookings")
    .select("*")
    .order("check_in", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createBooking(values: BookingFormValues) {
  const { data, error } = await requireSupabase()
    .from("bookings")
    .insert(toPayload(values))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateBooking(id: string, values: BookingFormValues) {
  const { data, error } = await requireSupabase()
    .from("bookings")
    .update(toPayload(values))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteBooking(id: string) {
  const { error } = await requireSupabase().from("bookings").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export function subscribeToBookings(onChange: () => void) {
  const client = requireSupabase();
  const channel = client
    .channel("public:bookings")
    .on<Booking>(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings" },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

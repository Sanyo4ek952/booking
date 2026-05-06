import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  deleteBooking,
  fetchBookings,
  subscribeToBookings,
  updateBooking,
} from "@/shared/api/bookings";
import { isSupabaseConfigured } from "@/shared/api/supabase";
import type { BookingFormValues } from "../model/types";

export const bookingsQueryKey = ["bookings"];

export function useBookings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    return subscribeToBookings(() => {
      void queryClient.invalidateQueries({ queryKey: bookingsQueryKey });
    });
  }, [queryClient]);

  return useQuery({
    queryKey: bookingsQueryKey,
    queryFn: fetchBookings,
    enabled: isSupabaseConfigured,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsQueryKey }),
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: BookingFormValues }) => updateBooking(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsQueryKey }),
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsQueryKey }),
  });
}

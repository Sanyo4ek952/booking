import { supabase } from "./supabase";
import type { CreateBookingRequestPayload, CreateBookingRequestResult } from "@/features/bookings/model/types";

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase не настроен. Заполните VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
}

export async function createBookingRequest(payload: CreateBookingRequestPayload) {
  const { data, error } = await requireSupabase().functions.invoke<CreateBookingRequestResult>("create-booking-request", {
    body: payload,
  });

  if (error) {
    const response = "context" in error ? error.context : null;

    if (response instanceof Response) {
      let responseErrorMessage: string | null = null;

      try {
        const errorBody = await response.json();
        if (typeof errorBody?.error === "string" && errorBody.error.trim()) {
          responseErrorMessage = errorBody.error.trim();
        } else if (typeof errorBody?.details === "string" && errorBody.details.trim()) {
          responseErrorMessage = errorBody.details.trim();
        }
      } catch {
        // Fall through to the generic error below when the response body is not JSON.
      }

      if (responseErrorMessage) {
        throw new Error(responseErrorMessage);
      }
    }

    throw error;
  }

  if (!data?.success) {
    throw new Error("Не удалось отправить заявку.");
  }

  return data;
}

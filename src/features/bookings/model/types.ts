import type { RoomId } from "@/entities/room";

export type BookingStatus = "reserved" | "paid" | "living" | "checked_out";

export type Booking = {
  id: string;
  room_id: RoomId;
  guest_name: string;
  phone: string;
  check_in: string;
  check_out: string;
  amount: number;
  status: BookingStatus;
  comment: string | null;
  created_at: string;
};

export type BookingFormValues = {
  room_id: RoomId;
  guest_name: string;
  phone: string;
  check_in: string;
  check_out: string;
  amount: string;
  status: BookingStatus;
  comment: string;
};

export type BookingRequestStatus = "new" | "processed" | "cancelled";

export type BookingRequest = {
  id: string;
  status: BookingRequestStatus;
  created_at: string;
  updated_at: string;
  telegram_sent: boolean;
  telegram_error: string | null;
  room_id: RoomId;
  room_name: string;
  guests: number;
  guest_name: string;
  phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  amount: number | null;
  nightly_price: number | null;
  comment: string | null;
  source: string;
  client_ip: string | null;
  user_agent: string | null;
};

export type CreateBookingRequestPayload = {
  room_id: RoomId;
  room_name: string;
  guests: number;
  guest_name: string;
  phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  amount: number | null;
  nightly_price: number | null;
  comment: string;
  source: string;
};

export type CreateBookingRequestResult = {
  success: boolean;
  bookingId?: string;
  request_id?: string;
  telegram_sent?: boolean;
  warning: string | null;
};

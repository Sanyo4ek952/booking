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

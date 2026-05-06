import type { BookingStatus } from "./types";

export const bookingStatuses: Array<{ value: BookingStatus; label: string; className: string }> = [
  { value: "reserved", label: "Бронь", className: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "paid", label: "Оплачено", className: "bg-sage-100 text-sage-700 border-sage-200" },
  { value: "living", label: "Проживает", className: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "checked_out", label: "Выехал", className: "bg-zinc-100 text-zinc-700 border-zinc-200" },
];

export const statusLabel = (status: BookingStatus) =>
  bookingStatuses.find((item) => item.value === status)?.label ?? status;

export const statusClassName = (status: BookingStatus) =>
  bookingStatuses.find((item) => item.value === status)?.className ?? "bg-zinc-100 text-zinc-700";

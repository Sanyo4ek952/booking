import type { RoomId } from "@/entities/room";
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

type PricePeriod = {
  period: string;
  price: number;
  from: [month: number, day: number];
  to: [month: number, day: number];
};

export type PriceSection = {
  title: string;
  roomIds: RoomId[];
  prices: PricePeriod[];
};

export const priceSections: PriceSection[] = [
  {
    title: "Номера 1 и 2",
    roomIds: ["room-1", "room-2"],
    prices: [
      { period: "май - 1 июня", price: 2700, from: [5, 1], to: [6, 1] },
      { period: "2 - 15 июня", price: 3750, from: [6, 2], to: [6, 15] },
      { period: "16 июня - 14 июля", price: 4375, from: [6, 16], to: [7, 14] },
      { period: "15 июля - 27 августа", price: 4750, from: [7, 15], to: [8, 27] },
      { period: "28 августа - 10 сентября", price: 3750, from: [8, 28], to: [9, 10] },
      { period: "11 сентября - 30 октября", price: 3000, from: [9, 11], to: [10, 30] },
    ],
  },
  {
    title: "Номер 3",
    roomIds: ["room-3"],
    prices: [
      { period: "май - 15 июня", price: 3125, from: [5, 1], to: [6, 14] },
      { period: "15 июня - 15 июля", price: 3750, from: [6, 15], to: [7, 14] },
      { period: "15 июля - 28 августа", price: 4125, from: [7, 15], to: [8, 27] },
      { period: "28 августа - 10 сентября", price: 3250, from: [8, 28], to: [9, 9] },
      { period: "10 сентября - конец октября", price: 2800, from: [9, 10], to: [10, 31] },
    ],
  },
  {
    title: "Номер 4",
    roomIds: ["room-4"],
    prices: [
      { period: "май - 14 июня", price: 4000, from: [5, 1], to: [6, 14] },
      { period: "15 июня - 10 июля", price: 5000, from: [6, 15], to: [7, 9] },
      { period: "10 июля - 28 августа", price: 5375, from: [7, 10], to: [8, 27] },
      { period: "28 августа - 15 сентября", price: 4500, from: [8, 28], to: [9, 15] },
      { period: "16 сентября - конец октября", price: 3800, from: [9, 16], to: [10, 31] },
    ],
  },
];

export const formatPrice = new Intl.NumberFormat("ru-RU").format;

export function getDiscountedPrice(price: number) {
  return Math.ceil(price * 0.8);
}

export function getRoomPriceForDate(roomId: RoomId, date: Date) {
  const section = priceSections.find((priceSection) => priceSection.roomIds.includes(roomId));

  if (!section) {
    return null;
  }

  const monthDay = (date.getMonth() + 1) * 100 + date.getDate();
  const price = section.prices.find(({ from, to }) => {
    const fromMonthDay = from[0] * 100 + from[1];
    const toMonthDay = to[0] * 100 + to[1];

    return monthDay >= fromMonthDay && monthDay <= toMonthDay;
  });

  return price ? getDiscountedPrice(price.price) : null;
}

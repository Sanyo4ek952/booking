import { eachDayOfInterval, format, parseISO, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";

export const dateInputFormat = "yyyy-MM-dd";

export function formatRuDate(date: string) {
  return format(parseISO(date), "d MMMM yyyy", { locale: ru });
}

export function formatShortRuDate(date: Date) {
  return format(date, "d MMM", { locale: ru });
}

export function todayInputValue() {
  return format(startOfDay(new Date()), dateInputFormat);
}

export function getCalendarDays(start: Date, end: Date) {
  return eachDayOfInterval({ start, end });
}

import type { Room } from "./types";

export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Номер 1",
    shortName: "1",
    description: "Светлый номер для коротких поездок и спокойного отдыха.",
    accentClass: "bg-sage-600",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    capacity: 2,
  },
  {
    id: "room-2",
    name: "Номер 2",
    shortName: "2",
    description: "Уютная комната с рабочей зоной и дополнительным местом.",
    accentClass: "bg-[#3f6f9f]",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    capacity: 3,
  },
  {
    id: "room-3",
    name: "Номер 3",
    shortName: "3",
    description: "Просторный вариант для семьи или компании гостей.",
    accentClass: "bg-[#936f45]",
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    capacity: 4,
  },
  {
    id: "room-4",
    name: "Номер 4",
    shortName: "4",
    description: "Комфортный номер повышенной категории с мягкой зоной.",
    accentClass: "bg-[#7a6d9c]",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    capacity: 4,
  },
];

export const roomById = new Map(rooms.map((room) => [room.id, room]));

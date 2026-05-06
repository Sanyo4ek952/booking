import type { Room } from "./types";

export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Студия A",
    shortName: "A",
    description: "Светлая студия для пары, вид на тихий двор.",
    accentClass: "bg-sage-600",
  },
  {
    id: "room-2",
    name: "Студия B",
    shortName: "B",
    description: "Компактная студия с рабочей зоной и мягким светом.",
    accentClass: "bg-[#3f6f9f]",
  },
  {
    id: "room-3",
    name: "Апартаменты C",
    shortName: "C",
    description: "Просторные апартаменты для длительного проживания.",
    accentClass: "bg-[#936f45]",
  },
  {
    id: "room-4",
    name: "Апартаменты D",
    shortName: "D",
    description: "Уютные апартаменты с отдельной зоной отдыха.",
    accentClass: "bg-[#7a6d9c]",
  },
];

export const roomById = new Map(rooms.map((room) => [room.id, room]));

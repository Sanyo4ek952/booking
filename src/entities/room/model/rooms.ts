import type { Room } from "./types";

export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Номер 1",
    shortName: "1",
    description: "Светлый номер для коротких поездок и спокойного отдыха.",
    fullDescription:
      "Компактный и светлый номер для двух гостей: отдельная спальная зона, место для хранения вещей и спокойная атмосфера для отдыха после дороги.",
    accentClass: "bg-sage-600",
    imageUrl: "/rooms/room-1.jpg",
    gallery: [
      "/rooms/room-1.jpg",
      "/rooms/room-1-2.jpg",
      "/rooms/room-1-3.jpg",
      "/rooms/room-1-4.jpg",
      "/rooms/room-1-5.jpg",
    ],
    capacity: 2,
    amenities: ["Двуспальная кровать", "Wi-Fi", "Кондиционер", "Телевизор", "Шкаф", "Полотенца"],
  },
  {
    id: "room-2",
    name: "Номер 2",
    shortName: "2",
    description: "Уютная комната с рабочей зоной и дополнительным местом.",
    fullDescription:
      "Удобный номер с рабочим столом и дополнительным спальным местом. Подойдет для пары или небольшой семьи, которой важны простор и практичность.",
    accentClass: "bg-[#3f6f9f]",
    imageUrl: "/rooms/room-2.jpg",
    gallery: [
      "/rooms/room-2.jpg",
      "/rooms/room-2-2.jpg",
      "/rooms/room-2-3.jpg",
      "/rooms/room-2-4.jpg",
      "/rooms/room-2-5.jpg",
      "/rooms/room-2-6.jpg",
    ],
    capacity: 3,
    amenities: ["Кровать", "Диван", "Wi-Fi", "Рабочий стол", "Кондиционер", "Холодильник"],
  },
  {
    id: "room-3",
    name: "Номер 3",
    shortName: "3",
    description: "Просторный вариант для семьи или компании гостей.",
    fullDescription:
      "Просторный номер для семьи или компании до четырех человек. Внутри есть место для отдыха, багажа и комфортного проживания на несколько дней.",
    accentClass: "bg-[#936f45]",
    imageUrl: "/rooms/room-3.jpg",
    gallery: [
      "/rooms/room-3.jpg",
      "/rooms/room-3-2.jpg",
      "/rooms/room-3-3.jpg",
      "/rooms/room-3-4.jpg",
      "/rooms/room-3-5.jpg",
      "/rooms/room-3-6.jpg",
    ],
    capacity: 4,
    amenities: ["Две кровати", "Wi-Fi", "Кондиционер", "Телевизор", "Хранение вещей", "Чайник"],
  },
  {
    id: "room-4",
    name: "Номер 4",
    shortName: "4",
    description: "Комфортный номер повышенной категории с мягкой зоной.",
    fullDescription:
      "Номер повышенной категории с мягкой зоной и приятным светом. Хороший выбор для гостей, которым нужно больше места и более спокойный формат отдыха.",
    accentClass: "bg-[#7a6d9c]",
    imageUrl: "/rooms/room-4.jpg",
    gallery: [
      "/rooms/room-4.jpg",
      "/rooms/room-4-2.jpg",
      "/rooms/room-4-3.jpg",
      "/rooms/room-4-4.jpg",
      "/rooms/room-4-5.jpg",
      "/rooms/room-4-6.jpg",
      "/rooms/room-4-7.jpg",
      "/rooms/room-4-8.jpg",
    ],
    capacity: 4,
    amenities: ["Большая кровать", "Мягкая зона", "Wi-Fi", "Кондиционер", "Телевизор", "Мини-холодильник"],
  },
];

export const roomById = new Map(rooms.map((room) => [room.id, room]));

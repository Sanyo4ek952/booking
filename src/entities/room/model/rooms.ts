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
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1582582494700-04865bf2a5f4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=80",
    ],
    capacity: 4,
    amenities: ["Большая кровать", "Мягкая зона", "Wi-Fi", "Кондиционер", "Телевизор", "Мини-холодильник"],
  },
];

export const roomById = new Map(rooms.map((room) => [room.id, room]));

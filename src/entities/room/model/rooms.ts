import type { Room } from "./types";

const sharedDescription = "Светлый номер для коротких поездок и спокойного отдыха.";

const sharedFullDescription =
  "Номер находится в 5-7 минутах ходьбы от моря. Удобное расположение. В номере все необходимое. Постельное бельё, полотенца предоставляем. Номер на 2-3 человека.";

const sharedAmenities = ["Двуспальная кровать", "Wi-Fi", "Кондиционер", "Телевизор", "Шкаф", "Полотенца"];

const sharedSleepingPlacesSummary = "2 кровати, 3 основных спальных места";

const sharedSleepingPlaces = [
  { id: "single-bed", label: "Односпальная кровать", quantity: 1 },
  { id: "double-bed", label: "Двуспальная кровать", quantity: 1 },
];

const sharedDetailSections = [
  {
    id: "basic",
    title: "Основные удобства",
    items: ["Кондиционер", "Беспроводной интернет Wi-Fi", "Телевизор", "Электрический чайник", "Микроволновка", "Холодильник"],
  },
  {
    id: "kitchen",
    title: "Кухонная зона",
    items: ["Электроплита", "Столовые приборы", "Морозильник", "Микроволновка", "Электрический чайник", "Обеденный стол", "Посуда и принадлежности", "Холодильник"],
  },
  {
    id: "bathroom",
    title: "Ванная комната",
    items: ["1 ванная комната с туалетом", "Душ", "Полотенца", "Туалетные принадлежности"],
  },
];

const room3Description = "Номер на 2-3 человека рядом с морем со всем необходимым для проживания.";

const room3FullDescription =
  "Номер находится в 5-7 минутах ходьбы от моря. Удобное расположение. В номере все необходимое. Постельное бельё, полотенца предоставляем. Номер на 2-3 человека.";

const room3Amenities = ["Кондиционер", "Беспроводной интернет Wi-Fi", "Телевизор", "Электрический чайник", "Микроволновка", "Холодильник"];

const room3SleepingPlacesSummary = "2 кровати, 3 основных спальных места";

const room3SleepingPlaces = [
  { id: "single-bed", label: "Односпальная кровать", quantity: 1 },
  { id: "double-bed", label: "Двуспальная кровать", quantity: 1 },
];

const room3DetailSections = [
  {
    id: "basic",
    title: "Основные удобства",
    items: room3Amenities,
  },
  {
    id: "kitchen",
    title: "Кухонная зона",
    items: ["Электроплита", "Столовые приборы", "Обеденный стол", "Микроволновка", "Электрический чайник", "Посуда и принадлежности", "Холодильник"],
  },
  {
    id: "bathroom",
    title: "Ванная комната",
    items: ["1 ванная комната с туалетом", "Общая ванная комната", "Полотенца", "Душ"],
  },
];

const room4Description = "Номер на 4 человека с балконом, видом на море и горы.";

const room4FullDescription =
  'Находится в 5-7 минутах ходьбы от моря. Удобное расположение. В номере все необходимое. Постельное бельё, полотенца предоставляем. Номер на 4 человека с балконом. Рядом на территории пансионата "звездный" есть платный бассейн.';

const room4Amenities = [
  "Кондиционер",
  "Балкон / лоджия",
  "Беспроводной интернет Wi-Fi",
  "Телевизор",
  "Электрический чайник",
  "Микроволновка",
  "Вид на море",
  "Вид на горы",
  "Холодильник",
];

const room4SleepingPlacesSummary = "3 кровати, 4 основных спальных места";

const room4SleepingPlaces = [
  { id: "single-bed", label: "Односпальная кровать", quantity: 2 },
  { id: "double-bed", label: "Двуспальная кровать", quantity: 1 },
];

const room4DetailSections = [
  {
    id: "basic",
    title: "Основные удобства",
    items: room4Amenities,
  },
  {
    id: "kitchen",
    title: "Кухонная зона",
    items: ["Электроплита", "Столовые приборы", "Морозильник", "Микроволновка", "Электрический чайник", "Кухонный гарнитур", "Посуда и принадлежности", "Холодильник", "Обеденный стол"],
  },
  {
    id: "bathroom",
    title: "Ванная комната",
    items: ["1 ванная комната с туалетом", "Душ", "Полотенца", "Туалетные принадлежности"],
  },
];

export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Номер 1",
    shortName: "1",
    description: sharedDescription,
    fullDescription: sharedFullDescription,
    accentClass: "bg-sage-600",
    imageUrl: "/rooms/room-1.jpg",
    gallery: [
      "/rooms/room-1.jpg",
      "/rooms/room-1-2.jpg",
      "/rooms/room-1-3.jpg",
      "/rooms/room-1-4.jpg",
      "/rooms/room-1-5.jpg",
    ],
    capacity: 3,
    amenities: sharedAmenities,
    sleepingPlacesSummary: sharedSleepingPlacesSummary,
    sleepingPlaces: sharedSleepingPlaces,
    detailSections: sharedDetailSections,
  },
  {
    id: "room-2",
    name: "Номер 2",
    shortName: "2",
    description: sharedDescription,
    fullDescription: sharedFullDescription,
    accentClass: "bg-ocean-600",
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
    amenities: sharedAmenities,
    sleepingPlacesSummary: sharedSleepingPlacesSummary,
    sleepingPlaces: sharedSleepingPlaces,
    detailSections: sharedDetailSections,
  },
  {
    id: "room-3",
    name: "Номер 3",
    shortName: "3",
    description: room3Description,
    fullDescription: room3FullDescription,
    accentClass: "bg-copper-600",
    imageUrl: "/rooms/room-3.jpg",
    gallery: [
      "/rooms/room-3.jpg",
      "/rooms/room-3-2.jpg",
      "/rooms/room-3-3.jpg",
      "/rooms/room-3-4.jpg",
      "/rooms/room-3-5.jpg",
      "/rooms/room-3-6.jpg",
    ],
    capacity: 3,
    amenities: room3Amenities,
    sleepingPlacesSummary: room3SleepingPlacesSummary,
    sleepingPlaces: room3SleepingPlaces,
    detailSections: room3DetailSections,
  },
  {
    id: "room-4",
    name: "Номер 4",
    shortName: "4",
    description: room4Description,
    fullDescription: room4FullDescription,
    accentClass: "bg-plum-600",
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
    amenities: room4Amenities,
    sleepingPlacesSummary: room4SleepingPlacesSummary,
    sleepingPlaces: room4SleepingPlaces,
    detailSections: room4DetailSections,
  },
];

export const roomById = new Map(rooms.map((room) => [room.id, room]));

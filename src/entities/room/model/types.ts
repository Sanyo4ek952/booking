export type RoomId = "room-1" | "room-2" | "room-3" | "room-4";

export type RoomSleepingPlace = {
  id: string;
  label: string;
  quantity: number;
};

export type RoomDetailSection = {
  id: string;
  title: string;
  items: string[];
};

export type Room = {
  id: RoomId;
  name: string;
  shortName: string;
  description: string;
  fullDescription: string;
  accentClass: string;
  imageUrl: string;
  gallery: string[];
  capacity: number;
  amenities: string[];
  sleepingPlacesSummary?: string;
  sleepingPlaces?: RoomSleepingPlace[];
  detailSections?: RoomDetailSection[];
};

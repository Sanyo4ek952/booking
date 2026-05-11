export type CreateRoomValues = {
  name: string;
  shortName: string;
  description: string;
  fullDescription: string;
  capacity: number;
  amenities: string[];
  photos: File[];
};

const backendUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, "");

function getRoomsEndpoint() {
  return backendUrl ? `${backendUrl}/api/rooms` : "/api/rooms";
}

export async function createRoom(values: CreateRoomValues) {
  const formData = new FormData();

  formData.append("name", values.name.trim());
  formData.append("shortName", values.shortName.trim());
  formData.append("description", values.description.trim());
  formData.append("fullDescription", values.fullDescription.trim());
  formData.append("capacity", String(values.capacity));
  formData.append("amenities", JSON.stringify(values.amenities));

  values.photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  const response = await fetch(getRoomsEndpoint(), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Не удалось создать объект.");
  }

  return response.json();
}

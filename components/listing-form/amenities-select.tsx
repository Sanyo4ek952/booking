"use client"

import type { Amenity } from "@/lib/types/listing"

interface AmenitiesSelectProps {
  value: Amenity[]
  onChange: (amenities: Amenity[]) => void
}

const AMENITIES: { value: Amenity; label: string }[] = [
  { value: "wifi", label: "WiFi" },
  { value: "kitchen", label: "Кухня" },
  { value: "washing_machine", label: "Стиральная машина" },
  { value: "air_conditioner", label: "Кондиционер" },
  { value: "parking", label: "Парковка" },
  { value: "pool", label: "Бассейн" },
  { value: "tv", label: "Телевизор" },
]

export function AmenitiesSelect({ value, onChange }: AmenitiesSelectProps) {
  const toggle = (amenity: Amenity) => {
    const newValue = value.includes(amenity) ? value.filter((a) => a !== amenity) : [...value, amenity]
    onChange(newValue)
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-3">Удобства</label>
      <div className="grid grid-cols-2 gap-3">
        {AMENITIES.map((amenity) => (
          <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(amenity.value)}
              onChange={() => toggle(amenity.value)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">{amenity.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

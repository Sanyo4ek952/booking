import { Check } from "lucide-react"

interface AmenitiesProps {
  amenities: string[]
}

export function Amenities({ amenities }: AmenitiesProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-4">Удобства</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-foreground/80">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

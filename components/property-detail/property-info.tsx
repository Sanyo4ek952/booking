import { Star, MapPin, Users, Bed, Bath } from "lucide-react"
import type { properties } from "@/lib/properties"

interface PropertyInfoProps {
  property: (typeof properties)[0]
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-3">{property.title}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-foreground/70">{property.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-accent text-accent" />
            <span className="font-semibold">{property.rating}</span>
            <span className="text-foreground/60">({property.reviews} отзывов)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
          <Users className="w-5 h-5 text-accent" />
          <div>
            <div className="text-xs text-foreground/60">Гостей</div>
            <div className="font-semibold">{property.guests}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
          <Bed className="w-5 h-5 text-accent" />
          <div>
            <div className="text-xs text-foreground/60">Спальни</div>
            <div className="font-semibold">{property.bedrooms}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
          <Bath className="w-5 h-5 text-accent" />
          <div>
            <div className="text-xs text-foreground/60">Ванные</div>
            <div className="font-semibold">{property.bathrooms}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
          <div className="text-xs text-foreground/60">Тип</div>
          <div className="font-semibold">{property.type}</div>
        </div>
      </div>

      <div className="prose prose-sm max-w-none">
        <h3 className="text-xl font-semibold text-foreground">Описание</h3>
        <p className="text-foreground/70 leading-relaxed">{property.description}</p>
      </div>
    </div>
  )
}

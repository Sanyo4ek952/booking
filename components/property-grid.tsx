import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users } from "lucide-react"
import type { Listing } from "@/lib/types/listing"

interface PropertyGridProps {
  listings: Listing[]
}

export function PropertyGrid({ listings }: PropertyGridProps) {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Популярное жилье в Судаке</h2>
          <p className="text-foreground/70">Лучшие варианты для вашего отдыха у моря</p>
        </div>

        {listings.length === 0 ? (
          <p className="text-foreground/60">Пока нет объявлений. Будьте первым, кто разместит жильё!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-64 bg-muted overflow-hidden group">
                    <img
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-foreground capitalize">
                      {property.type}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-foreground line-clamp-2">{property.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <MapPin className="w-4 h-4" />
                        {property.city}, {property.address}
                      </div>
                    </div>

                    {property.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.slice(0, 2).map((amenity, idx) => (
                          <span
                            key={`${property.id}-${amenity}-${idx}`}
                            className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-foreground/70">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">до {property.guests} гостей</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">₽{Number(property.price).toLocaleString()}</div>
                        <div className="text-xs text-foreground/60">за ночь</div>
                      </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Забронировать</Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

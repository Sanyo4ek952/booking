"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Heart, Users } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { properties } from "@/lib/properties"

export function PropertyGrid() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Популярное жилье в Судаке</h2>
          <p className="text-foreground/70">Лучшие варианты для вашего отдыха у моря</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link key={property.id} href={`/property/${property.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                {/* Image */}
                <div className="relative h-64 bg-muted overflow-hidden group">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 hover:bg-white rounded-full"
                      onClick={() => toggleFavorite(property.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(property.id) ? "fill-accent text-accent" : "text-foreground/40"
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-foreground">
                    {property.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground line-clamp-2">{property.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 2).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold text-foreground">{property.rating}</span>
                    </div>
                    <span className="text-sm text-foreground/60">({property.reviews})</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-foreground/70">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">до {property.guests} гостей</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">₽{property.price.toLocaleString()}</div>
                      <div className="text-xs text-foreground/60">за ночь</div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Забронировать
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { useState } from "react"

export function SearchBar() {
  const [dates, setDates] = useState({ from: "", to: "" })
  const [guests, setGuests] = useState("2")

  return (
    <section className="relative -mt-12 px-4 sm:px-6 lg:px-8 pb-12 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Направление</label>
              <div className="flex items-center gap-2 p-3 bg-input rounded-lg">
                <MapPin className="w-4 h-4 text-primary" />
                <select className="w-full bg-transparent outline-none text-foreground">
                  <option>Судак</option>
                  <option>Новый Свет</option>
                  <option>Весёлое</option>
                </select>
              </div>
            </div>

            {/* Check-in */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Заезд</label>
              <div className="flex items-center gap-2 p-3 bg-input rounded-lg">
                <Calendar className="w-4 h-4 text-primary" />
                <input
                  type="date"
                  value={dates.from}
                  onChange={(e) => setDates({ ...dates, from: e.target.value })}
                  className="w-full bg-transparent outline-none text-foreground"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Выезд</label>
              <div className="flex items-center gap-2 p-3 bg-input rounded-lg">
                <Calendar className="w-4 h-4 text-primary" />
                <input
                  type="date"
                  value={dates.to}
                  onChange={(e) => setDates({ ...dates, to: e.target.value })}
                  className="w-full bg-transparent outline-none text-foreground"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Гости</label>
              <div className="flex items-center gap-2 p-3 bg-input rounded-lg">
                <Users className="w-4 h-4 text-primary" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent outline-none text-foreground"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4+</option>
                </select>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold">
            Поиск жилья
          </Button>
        </div>
      </div>
    </section>
  )
}

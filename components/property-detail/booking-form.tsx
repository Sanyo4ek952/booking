"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, UsersIcon } from "lucide-react"
import type { Listing } from "@/lib/types/listing"

interface BookingFormProps {
  property: Listing
}

export function BookingForm({ property }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)

  const nights =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      : 0
  const totalPrice = nights > 0 ? property.price * nights : 0

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Выберите даты заезда и выезда")
      return
    }
    if (guests > property.guests) {
      alert(`Максимум ${property.guests} гостей`)
      return
    }
    alert(`Бронирование: ${checkIn} - ${checkOut}, ${guests} гостей. Сумма: ₽${totalPrice.toLocaleString()}`)
  }

  return (
    <Card className="p-6 sticky top-24 space-y-6">
      <div>
        <div className="text-3xl font-bold text-primary">₽{property.price.toLocaleString()}</div>
        <div className="text-sm text-foreground/60">за ночь</div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Дата заезда
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Дата выезда
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Количество гостей
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number.parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Array.from({ length: property.guests }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "гость" : "гостей"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {nights > 0 && (
        <div className="space-y-2 py-4 border-t border-border">
          <div className="flex justify-between text-foreground/70">
            <span>
              ₽{property.price.toLocaleString()} × {nights} ночей
            </span>
            <span>₽{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
            <span>Итого</span>
            <span className="text-primary">₽{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleBooking}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
      >
        Забронировать
      </Button>

      <div className="text-xs text-foreground/60 text-center">Вы не будете заряжены до подтверждения</div>
    </Card>
  )
}

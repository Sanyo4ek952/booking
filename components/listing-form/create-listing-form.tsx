"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { createListingAction, type ListingActionState } from "@/lib/listings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Amenity } from "@/lib/types/listing"

const AMENITIES: { value: Amenity; label: string }[] = [
  { value: "wifi", label: "WiFi" },
  { value: "kitchen", label: "Кухня" },
  { value: "washing_machine", label: "Стиральная машина" },
  { value: "air_conditioner", label: "Кондиционер" },
  { value: "parking", label: "Парковка" },
  { value: "pool", label: "Бассейн" },
  { value: "tv", label: "Телевизор" },
]

const initialState: ListingActionState = {
  error: "",
  message: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Создание..." : "Создать объявление"}
    </Button>
  )
}

export function CreateListingForm() {
  const [state, formAction] = useActionState(createListingAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message && formRef.current) {
      formRef.current.reset()
    }
  }, [state.message])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 max-w-2xl"
      encType="multipart/form-data"
    >
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="title">
          Название
        </label>
        <Input id="title" name="title" placeholder="Красивая вилла с видом на море" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="description">
          Описание
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Подробное описание вашего жилья..."
          rows={5}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="price">
            Цена за ночь (₽)
          </label>
          <Input id="price" name="price" type="number" min="1" step="0.01" placeholder="5000" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="type">
            Тип жилья
          </label>
          <select id="type" name="type" className="w-full px-3 py-2 border rounded-lg" required>
            <option value="">Выберите тип</option>
            <option value="apartment">Апартамент</option>
            <option value="house">Дом</option>
            <option value="room">Комната</option>
            <option value="villa">Вилла</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="address">
          Адрес
        </label>
        <Input id="address" name="address" placeholder="ул. Пляжная, дом 10" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="city">
          Город
        </label>
        <Input id="city" name="city" placeholder="Судак" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="guests">
            Гости
          </label>
          <Input id="guests" name="guests" type="number" min="1" placeholder="4" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="bedrooms">
            Спальни
          </label>
          <Input id="bedrooms" name="bedrooms" type="number" min="1" placeholder="2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="bathrooms">
            Ванные
          </label>
          <Input id="bathrooms" name="bathrooms" type="number" min="1" placeholder="1" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="images">
          Фото
        </label>
        <Input id="images" name="images" type="file" accept="image/*" multiple required />
        <p className="text-xs text-muted-foreground mt-1">Загрузите несколько изображений жилья</p>
      </div>

      <div>
        <p className="block text-sm font-medium mb-3">Удобства</p>
        <div className="grid grid-cols-2 gap-3">
          {AMENITIES.map((amenity) => (
            <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="amenities" value={amenity.value} className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.message && <p className="text-sm text-green-600">{state.message}</p>}

      <SubmitButton />
    </form>
  )
}

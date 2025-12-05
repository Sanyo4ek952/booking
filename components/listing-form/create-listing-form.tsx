"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createListingSchema, type CreateListingInput } from "@/lib/validations/listing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"
import { AmenitiesSelect } from "./amenities-select"
import type { Amenity } from "@/lib/types/listing"

export function CreateListingForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
  })

  const onSubmit = async (data: CreateListingInput) => {
    if (images.length === 0) {
      alert("Загрузите хотя бы одно фото")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images,
          amenities,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Ошибка создания объявления")
      }

      alert("Объявление успешно создано!")
      reset()
      setImages([])
      setAmenities([])
      router.push("/dashboard/host")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Ошибка")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-2">Название</label>
        <Input {...register("title")} placeholder="Красивая вилла с видом на море" />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Описание</label>
        <Textarea {...register("description")} placeholder="Подробное описание вашего жилья..." rows={5} />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Цена за ночь (₽)</label>
          <Input {...register("price")} type="number" placeholder="5000" />
          {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Тип жилья</label>
          <select {...register("type")} className="w-full px-3 py-2 border rounded-lg">
            <option value="">Выберите тип</option>
            <option value="apartment">Апартамент</option>
            <option value="house">Дом</option>
            <option value="room">Комната</option>
            <option value="villa">Вилла</option>
          </select>
          {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Адрес</label>
        <Input {...register("address")} placeholder="ул. Пляжная, дом 10" />
        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Город</label>
        <Input {...register("city")} placeholder="Судак" />
        {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Гости</label>
          <Input {...register("guests")} type="number" placeholder="4" />
          {errors.guests && <p className="text-sm text-red-500 mt-1">{errors.guests.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Спальни</label>
          <Input {...register("bedrooms")} type="number" placeholder="2" />
          {errors.bedrooms && <p className="text-sm text-red-500 mt-1">{errors.bedrooms.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ванные</label>
          <Input {...register("bathrooms")} type="number" placeholder="1" />
          {errors.bathrooms && <p className="text-sm text-red-500 mt-1">{errors.bathrooms.message}</p>}
        </div>
      </div>

      <ImageUpload onImagesChange={setImages} />

      <AmenitiesSelect value={amenities} onChange={setAmenities} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Создание..." : "Создать объявление"}
      </Button>
    </form>
  )
}

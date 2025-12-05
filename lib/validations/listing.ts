import { z } from "zod"

export const createListingSchema = z.object({
  title: z.string().min(5, "Минимум 5 символов").max(100, "Максимум 100 символов"),
  description: z.string().min(20, "Минимум 20 символов"),
  price: z.coerce.number().min(1, "Цена должна быть больше 0"),
  address: z.string().min(5, "Введите адрес"),
  city: z.string().min(2, "Введите город"),
  type: z.enum(["apartment", "house", "room", "villa"], {
    errorMap: () => ({ message: "Выберите тип жилья" }),
  }),
  guests: z.coerce.number().min(1, "Минимум 1 гость"),
  bedrooms: z.coerce.number().min(1, "Минимум 1 спальня"),
  bathrooms: z.coerce.number().min(1, "Минимум 1 ванная"),
  amenities: z.array(z.enum(["wifi", "kitchen", "washing_machine", "air_conditioner", "parking", "pool", "tv"])),
})

export type CreateListingInput = z.infer<typeof createListingSchema>

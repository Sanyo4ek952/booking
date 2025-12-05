"use server"

import { randomUUID } from "crypto"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Amenity, ListingFormData } from "@/lib/types/listing"
import { createListingSchema } from "@/lib/validations/listing"

export interface ListingActionState {
  error: string
  message: string
  formData?: ListingFormData
}

async function uploadImages(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  files: File[],
): Promise<{ urls: string[]; error?: string }> {
  const uploadedUrls: string[] = []

  for (const file of files) {
    const extension = file.name.split(".").pop() || "jpg"
    const path = `listings/${userId}/${randomUUID()}.${extension}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage.from("listing-images").upload(path, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    })

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError)
      return { urls: [], error: "Не удалось загрузить фото. Попробуйте позже." }
    }

    const { data: publicData } = supabase.storage.from("listing-images").getPublicUrl(path)
    uploadedUrls.push(publicData.publicUrl)
  }

  return { urls: uploadedUrls }
}

export async function createListingAction(_: ListingActionState, formData: FormData): Promise<ListingActionState> {
  const filledForm: ListingFormData = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    type: String(formData.get("type") ?? ""),
    guests: Number(formData.get("guests") ?? 0),
    bedrooms: Number(formData.get("bedrooms") ?? 0),
    bathrooms: Number(formData.get("bathrooms") ?? 0),
    amenities: formData.getAll("amenities").map((value) => String(value)) as Amenity[],
  }

  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: "Необходима авторизация", message: "", formData: filledForm }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Failed to load user role:", profileError)
      return { error: "Не удалось получить данные профиля", message: "", formData: filledForm }
    }

    if (profile?.role !== "host") {
      return { error: "Только хост может размещать объявления", message: "", formData: filledForm }
    }

    const parsed = createListingSchema.safeParse(filledForm)

    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      return { error: issue?.message || "Проверьте корректность данных", message: "", formData: filledForm }
    }

    const imageFiles = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0)

    if (imageFiles.length === 0) {
      return { error: "Загрузите хотя бы одно фото", message: "", formData: filledForm }
    }

    const { urls, error: uploadError } = await uploadImages(supabase, user.id, imageFiles)

    if (uploadError) {
      return { error: uploadError, message: "", formData: filledForm }
    }

    const { error: insertError } = await supabase.from("listings").insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      price: parsed.data.price,
      address: parsed.data.address,
      city: parsed.data.city,
      type: parsed.data.type,
      guests: parsed.data.guests,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      amenities: parsed.data.amenities,
      images: urls,
    })

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      return {
        error: "Что-то пошло не так. Проверьте введённые данные.",
        message: "",
        formData: filledForm,
      }
    }

    return { error: "", message: "Объявление создано" }
  } catch (error) {
    console.error("createListingAction error:", error)
    return {
      error: "Что-то пошло не так. Проверьте введённые данные.",
      message: "",
      formData: filledForm,
    }
  }
}

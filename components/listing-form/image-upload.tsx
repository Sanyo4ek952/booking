"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void
  maxFiles?: number
}

export function ImageUpload({ onImagesChange, maxFiles = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])

      if (images.length + files.length > maxFiles) {
        setError(`Максимум ${maxFiles} фото`)
        return
      }

      setIsUploading(true)
      setError(null)

      try {
        const supabase = createClient()
        const uploadedUrls: string[] = []

        for (const file of files) {
          const timestamp = Date.now()
          const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}`

          const { data, error: uploadError } = await supabase.storage.from("listing-images").upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          })

          if (uploadError) throw uploadError

          const { data: publicData } = supabase.storage.from("listing-images").getPublicUrl(data.path)

          uploadedUrls.push(publicData.publicUrl)
        }

        const newImages = [...images, ...uploadedUrls]
        setImages(newImages)
        onImagesChange(newImages)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки")
      } finally {
        setIsUploading(false)
      }
    },
    [images, maxFiles, onImagesChange],
  )

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Фото ({images.length}/{maxFiles})
        </label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || images.length >= maxFiles}
          className="cursor-pointer"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-square">
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

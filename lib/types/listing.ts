export type ListingType = "apartment" | "house" | "room" | "villa"

export type Amenity = "wifi" | "kitchen" | "washing_machine" | "air_conditioner" | "parking" | "pool" | "tv"

export interface Listing {
  id: string
  host_id: string
  title: string
  description: string
  price: number
  address: string
  city: string
  type: ListingType
  guests: number
  bedrooms: number
  bathrooms: number
  amenities: Amenity[]
  images: string[]
  created_at: string
  updated_at: string
}

export interface CreateListingInput {
  title: string
  description: string
  price: number
  address: string
  city: string
  type: ListingType
  guests: number
  bedrooms: number
  bathrooms: number
  amenities: Amenity[]
  images: File[]
}

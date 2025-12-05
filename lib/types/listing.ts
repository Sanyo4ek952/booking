export type ListingType = "apartment" | "house" | "room" | "villa"

export type Amenity = "wifi" | "kitchen" | "washing_machine" | "air_conditioner" | "parking" | "pool" | "tv"

export interface Listing {
  id: string
  user_id: string
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
  images: string[]
}

export interface ListingFormData {
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
}

import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageGallery } from "@/components/property-detail/image-gallery"
import { PropertyInfo } from "@/components/property-detail/property-info"
import { BookingForm } from "@/components/property-detail/booking-form"
import { Amenities } from "@/components/property-detail/amenities"
import { getListingById } from "@/lib/listings/queries"

interface PropertyPageProps {
  params: { id: string }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { data: property } = await getListingById(params.id)

  if (!property) {
    notFound()
  }

  const images = property.images?.length ? property.images : ["/placeholder.svg"]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ImageGallery images={images} title={property.title} />
              <PropertyInfo property={property} />
              <Amenities amenities={property.amenities ?? []} />
            </div>

            <div className="lg:col-span-1">
              <BookingForm property={property} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

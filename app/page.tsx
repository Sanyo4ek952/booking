import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { PropertyGrid } from "@/components/property-grid"
import { MapSection } from "@/components/map-section"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { getListings } from "@/lib/listings/queries"

export default async function Home() {
  const { data: listings, error } = await getListings()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SearchBar />
      <div className="container mx-auto px-4">
        {error && <p className="text-red-500 mb-4">Не удалось загрузить объявления</p>}
      </div>
      <PropertyGrid listings={listings} />
      <MapSection />
      <Features />
      <Footer />
    </main>
  )
}

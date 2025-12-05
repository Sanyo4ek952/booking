import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { PropertyGrid } from "@/components/property-grid"
import { MapSection } from "@/components/map-section"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SearchBar />
      <PropertyGrid />
      <MapSection />
      <Features />
      <Footer />
    </main>
  )
}

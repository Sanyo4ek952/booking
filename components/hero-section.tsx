export function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"
        style={{
          backgroundImage: "url(/placeholder.svg?height=600&width=1200&query=stunning-sudak-beach-with-mountains)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-pretty">Отдых у моря в Судаке</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            Забронируй идеальное жилье с видом на Черное море. Комфорт, красота и лучший отдых ждут тебя
          </p>
        </div>
      </div>
    </section>
  )
}

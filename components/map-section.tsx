"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    ymaps: any
  }
}

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const script = document.createElement("script")
    script.src = "https://api-maps.yandex.ru/2.1/?apikey=68a2e95c-4d7c-4a24-8c49-21ee48ac9f67&lang=ru_RU"
    script.async = true

    script.onload = () => {
      if (!window.ymaps) return

      window.ymaps.ready(() => {
        if (mapInstanceRef.current) return

        try {
          const map = new window.ymaps.Map(mapRef.current, {
            center: [44.841951, 34.975913],
            zoom: 17,
            controls: ["zoomControl", "fullscreenControl"],
          })

          const startCoords = [44.843888, 34.976946] // lat, lon for Yandex
          const endCoords = [44.840014, 34.974254]

          const startMarker = new window.ymaps.Placemark(
            startCoords,
            { balloonContent: "Жилье" },
            { preset: "islands#blueDotIcon" },
          )

          const endMarker = new window.ymaps.Placemark(
            endCoords,
            { balloonContent: "Пляж" },
            { preset: "islands#redDotIcon" },
          )

          map.geoObjects.add(startMarker)
          map.geoObjects.add(endMarker)

          mapInstanceRef.current = map
        } catch (err) {
          console.error("[v0] Error initializing map:", err)
        }
      })
    }

    script.onerror = () => {
      console.error("Ошибка при загрузке карты")
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Маршрут до моря</h2>
          <p className="text-foreground/70">Пешеходный маршрут от жилья до пляжа</p>
        </div>

        <div className="w-full rounded-lg overflow-hidden shadow-lg border border-border">
          <iframe
            src="https://yandex.ru/map-widget/v1/?azimuth=0.26808257310632905&ll=34.976123%2C44.841977&mode=routes&rtext=44.843888%2C34.976946~44.840014%2C34.974254&rtt=pd&ruri=~&source=serp_navig&z=17.65"
            width="100%"
            height="500"
            frameBorder="1"
            allowFullScreen={true}
            style={{ borderRadius: "var(--radius)" }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center p-4 bg-background rounded-lg border border-border">
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-1">Расстояние</p>
            <p className="text-2xl font-bold text-primary">680 м</p>
          </div>
          <div className="hidden sm:block w-px bg-border" />
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-1">Время в пути (пешком)</p>
            <p className="text-2xl font-bold text-primary">9 мин</p>
          </div>
        </div>

        <p className="text-center text-sm text-foreground/60">
          Карта показывает пешеходный маршрут от жилья до пляжа. Нажмите на маршрут для получения подробных указаний.
        </p>
      </div>
    </section>
  )
}

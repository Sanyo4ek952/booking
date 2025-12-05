import { Shield, Clock, MapPin, ThumbsUp } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Безопасное бронирование",
    description: "Защита платежей и гарантия возврата средств",
  },
  {
    icon: Clock,
    title: "Быстрая поддержка",
    description: "24/7 служба поддержки на русском языке",
  },
  {
    icon: MapPin,
    title: "Лучшие места",
    description: "Жилье в самых красивых районах Судака",
  },
  {
    icon: ThumbsUp,
    title: "Проверенные хозяева",
    description: "Все собственники прошли верификацию",
  },
]

export function Features() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-foreground">{feature.title}</h3>
                <p className="text-foreground/70 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

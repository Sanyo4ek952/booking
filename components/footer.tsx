import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-foreground font-bold text-sm">
                СУ
              </div>
              <span className="font-bold">Судак Отдых</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Надежная платформа для бронирования лучшего жилья у моря в Судаке
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="font-semibold">Навигация</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  Жилье
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  Отзывы
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  Блог
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <h4 className="font-semibold">Поддержка</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  Центр помощи
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  Правила бронирования
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition">
                  Условия использования
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold">Контакты</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Судак, Крым</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+7 (555) 123-45-67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@sudak-otdyh.ru</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-primary-foreground/60">
            <p>&copy; 2025 Судак Отдых. Все права защищены.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary-foreground transition">
                Facebook
              </a>
              <a href="#" className="hover:text-primary-foreground transition">
                Instagram
              </a>
              <a href="#" className="hover:text-primary-foreground transition">
                VK
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

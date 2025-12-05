"use client"

import { Menu, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"
import { useRole } from "@/hooks/use-role"

export function Header() {
  const { user, isHost, isGuest, isLoading } = useRole()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              СУ
            </div>
            <span className="font-bold text-foreground text-lg hidden sm:inline">Судак Отдых</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-foreground/70 hover:text-primary transition">
              Жилье
            </a>
            <a href="#" className="text-sm text-foreground/70 hover:text-primary transition">
              Отзывы
            </a>
            <a href="#" className="text-sm text-foreground/70 hover:text-primary transition">
              О нас
            </a>
            <a href="#" className="text-sm text-foreground/70 hover:text-primary transition">
              Контакты
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Heart className="w-5 h-5" />
            </Button>

            {!isLoading && (
              <>
                {!user && (
                  <Link href="/auth/login">
                    <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90">Войти</Button>
                  </Link>
                )}
                {isHost && (
                  <Link href="/listing/create">
                    <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90">
                      Разместить объявление
                    </Button>
                  </Link>
                )}
                {isGuest && (
                  <Link href="/">
                    <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90">Найти жильё</Button>
                  </Link>
                )}
              </>
            )}

            <UserMenu />
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

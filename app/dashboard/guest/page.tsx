import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, Home, Heart, MessageSquare } from "lucide-react"
import { getCurrentRole, getCurrentUser } from "@/lib/auth/server"

export const metadata = {
  title: "Личный кабинет гостя | Судак Отдых",
}

export default async function GuestDashboardPage() {
  const user = await getCurrentUser()
  const role = await getCurrentRole()

  if (!user) {
    redirect("/auth/login")
  }

  if (role !== "guest") {
    redirect(`/dashboard/${role ?? "guest"}`)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Личный кабинет гостя</h1>
            <p className="text-foreground/60">Добро пожаловать, {user.email}</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ChevronLeft className="w-4 h-4" />
              На главную
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Мои бронирования
              </CardTitle>
              <CardDescription>Ваши зарезервированные объекты</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">У вас пока нет активных бронирований</p>
              <Link href="/">
                <Button size="sm" variant="outline">
                  Найти жильё
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Избранное
              </CardTitle>
              <CardDescription>Сохранённые объекты</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">У вас пока нет избранных объектов</p>
              <Button size="sm" variant="outline" disabled>
                Смотреть позже
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Сообщения
              </CardTitle>
              <CardDescription>Общение с хостами</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">Новых сообщений нет</p>
              <Button size="sm" variant="outline" disabled>
                Открыть чат
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>Управление данными</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground/60">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Статус</p>
                  <p className="font-medium text-primary">Гость</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>История бронирований</CardTitle>
              <CardDescription>Ваши прошлые бронирования</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">История пуста</p>
              <Button size="sm" variant="outline" disabled>
                Просмотреть
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Помощь и поддержка</CardTitle>
              <CardDescription>Свяжитесь с нами</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">Есть вопросы?</p>
              <Button size="sm" variant="outline">
                Написать в поддержку
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

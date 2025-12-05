import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, Plus, BarChart3, Users, Calendar } from "lucide-react"

export const metadata = {
  title: "Личный кабинет хоста | Судак Отдых",
}

export default async function HostDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "host") {
    redirect(`/dashboard/${profile?.role || "guest"}`)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Личный кабинет хоста</h1>
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
          <Card className="lg:col-span-1 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Разместить объявление
              </CardTitle>
              <CardDescription>Добавьте новое жильё</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">Начните сдавать жильё и зарабатывайте</p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Создать объявление
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Мои объявления
              </CardTitle>
              <CardDescription>Активные объекты</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-primary">0</div>
                <p className="text-foreground/60 text-sm">Активных объявлений</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Бронирования
              </CardTitle>
              <CardDescription>Запросы от гостей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-primary">0</div>
                <p className="text-foreground/60 text-sm">Новых бронирований</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Гости
              </CardTitle>
              <CardDescription>Общение с арендаторами</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">Новых сообщений нет</p>
              <Button size="sm" variant="outline" disabled>
                Открыть сообщения
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Профиль хоста</CardTitle>
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
                  <p className="font-medium text-primary">Хост</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
              <CardDescription>Аналитика</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground/60">Рейтинг</p>
                  <p className="font-medium">Нет оценок</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

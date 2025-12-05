import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Личный кабинет | Судак Отдых",
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Личный кабинет</h1>
            <p className="text-foreground/60">Добро пожаловать, {user.email}</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ChevronLeft className="w-4 h-4" />
              На главную
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Мои бронирования</CardTitle>
              <CardDescription>Список ваших зарезервированных объектов</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm">У вас пока нет бронирований</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Избранное</CardTitle>
              <CardDescription>Сохраненные объекты недвижимости</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm">У вас пока нет избранных объектов</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>Управление данными аккаунта</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground/60">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Помощь</CardTitle>
              <CardDescription>Свяжитесь с поддержкой</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/60 text-sm mb-4">Есть вопросы? Мы здесь, чтобы помочь</p>
              <Button variant="outline">Написать в поддержку</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

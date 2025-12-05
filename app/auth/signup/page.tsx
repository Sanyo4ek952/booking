import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Регистрация | Судак Отдых",
  description: "Создайте новый аккаунт",
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center py-12 px-4">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Судак Отдых</h1>
          <p className="text-foreground/60">Создайте новый аккаунт</p>
        </div>
        <AuthForm type="signup" />
      </div>
    </main>
  )
}

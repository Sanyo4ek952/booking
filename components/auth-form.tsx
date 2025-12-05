"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signInAction, signInWithOAuthAction, signUpAction } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface AuthFormProps {
  type: "login" | "signup"
}

const initialState = {
  error: undefined,
  message: undefined,
} satisfies { error?: string; message?: string }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={pending}>
      {pending ? "Загрузка..." : label}
    </Button>
  )
}

export function AuthForm({ type }: AuthFormProps) {
  const action = type === "signup" ? signUpAction : signInAction
  const [state, formAction] = useActionState(action, initialState)
  const [oauthState, oauthAction] = useActionState(signInWithOAuthAction, initialState)

  const error = state.error ?? oauthState.error
  const message = state.message ?? oauthState.message

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === "login" ? "Вход" : "Регистрация"}</CardTitle>
        <CardDescription>
          {type === "login" ? "Введите свои учетные данные для входа" : "Создайте новый аккаунт"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Пароль
            </label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          {type === "signup" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Я хочу:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="role" value="guest" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Снять жильё (гость)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="role" value="host" className="w-4 h-4" />
                  <span className="text-sm">Разместить жильё (хост)</span>
                </label>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-muted-foreground">{message}</p>}

          <SubmitButton label={type === "login" ? "Вход" : "Регистрация"} />
        </form>

        <div className="my-6">
          <Separator className="my-4" />
          <form action={oauthAction} className="space-y-3">
            <input type="hidden" name="provider" value="github" />
            <Button type="submit" variant="outline" className="w-full">
              Войти через GitHub
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          {type === "login" ? (
            <>
              Нет аккаунта?{" "}
              <a href="/auth/signup" className="text-primary hover:underline">
                Зарегистрируйтесь
              </a>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <a href="/auth/login" className="text-primary hover:underline">
                Войдите
              </a>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

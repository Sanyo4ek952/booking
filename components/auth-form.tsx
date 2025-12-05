"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Role } from "@/lib/types/role"

interface AuthFormProps {
  type: "login" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<Role>("guest")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (type === "signup") {
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Пароли не совпадают",
          })
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
            data: {
              role,
            },
          },
        })

        if (error) {
          toast({
            variant: "destructive",
            title: "Ошибка регистрации",
            description: error.message,
          })
        } else if (data.user) {
          try {
            await fetch("/api/auth/create-profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: data.user.id,
                email,
                role,
              }),
            })
          } catch (profileError) {
            console.error("Error creating profile:", profileError)
          }

          toast({
            title: "Успешно!",
            description: "Проверьте почту для подтверждения",
          })
          setTimeout(() => router.push("/auth/login"), 2000)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          toast({
            variant: "destructive",
            title: "Ошибка входа",
            description: error.message,
          })
        } else {
          toast({
            title: "Добро пожаловать!",
            description: "Вы успешно вошли",
          })
          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла неожиданная ошибка",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === "login" ? "Вход" : "Регистрация"}</CardTitle>
        <CardDescription>
          {type === "login" ? "Введите свои учетные данные для входа" : "Создайте новый аккаунт"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {type === "signup" && (
            <>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Подтвердите пароль
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Я хочу:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="guest"
                      checked={role === "guest"}
                      onChange={(e) => setRole(e.target.value as Role)}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Снять жильё (гость)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="host"
                      checked={role === "host"}
                      onChange={(e) => setRole(e.target.value as Role)}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Разместить жильё (хост)</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
            {loading ? "Загрузка..." : type === "login" ? "Вход" : "Регистрация"}
          </Button>

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
        </form>
      </CardContent>
    </Card>
  )
}

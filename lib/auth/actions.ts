"use server"

import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect"
import { createServerClient } from "@supabase/ssr"
import type { Provider } from "@supabase/supabase-js"
import { createServiceRoleClient } from "@/lib/supabase/admin"
import type { Role } from "@/lib/types/role"

export interface AuthFormState {
  error?: string
  message?: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function createActionClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {}
      },
      remove(name, options) {
        try {
          cookieStore.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          })
        } catch {}
      },
    },
  })
}

async function getRedirectBase() {
  const incomingHeaders = await headers()
  return incomingHeaders.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
}

async function resolveUserRole(userId: string): Promise<Role | null> {
  const supabase = createServiceRoleClient()
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single()

  return (data?.role as Role | null) ?? null
}

async function ensureProfile(userId: string, email: string, role: Role) {
  const supabase = createServiceRoleClient()
  await supabase
    .from("profiles")
    .upsert(
      { id: userId, email, role },
      {
        onConflict: "id",
      },
    )
}

export async function signUpAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  try {
    const supabase = await createActionClient()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const role = (formData.get("role") as Role) || "guest"
    const redirectTo = `${await getRedirectBase()}/auth/callback`

    if (!email || !password) {
      return { error: "Введите email и пароль", message: "" }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { role },
      },
    })

    if (error) {
      return { error: error.message, message: "" }
    }

    const user = data.user

    if (user) {
      await ensureProfile(user.id, user.email ?? email, role)
    }

    if (data.session?.user) {
      const storedRole = (await resolveUserRole(data.session.user.id)) ?? role
      redirect(`/dashboard/${storedRole}`)
    }

    return {
      error: "",
      message: "Подтвердите email, чтобы завершить регистрацию",
    }
  } catch (err) {
    if (isRedirectError(err)) {
      throw err
    }
    console.error("Auth action error:", err)
    return {
      error: "Что-то пошло не так. Попробуйте позже.",
      message: "",
    }
  }
}

export async function signInAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  try {
    const supabase = await createActionClient()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
      return { error: "Введите email и пароль", message: "" }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message, message: "" }
    }

    const user = data.session?.user

    if (!user) {
      return { error: "Не удалось получить пользователя", message: "" }
    }

    const role = (await resolveUserRole(user.id)) ?? "guest"

    redirect(`/dashboard/${role}`)
  } catch (err) {
    if (isRedirectError(err)) {
      throw err
    }
    console.error("Auth action error:", err)
    return {
      error: "Что-то пошло не так. Попробуйте позже.",
      message: "",
    }
  }
}

export async function signInWithOAuthAction(provider: Provider): Promise<AuthFormState | void> {
  try {
    const supabase = await createActionClient()
    const redirectTo = `${await getRedirectBase()}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      return { error: "Что-то пошло не так при входе через OAuth. Попробуйте позже.", message: "" }
    }

    if (data.url) {
      redirect(data.url)
    }

    redirect("/auth/login")
  } catch (err) {
    if (isRedirectError(err)) {
      throw err
    }
    console.error("Auth action error:", err)
    return { error: "Что-то пошло не так при входе через OAuth. Попробуйте позже.", message: "" }
  }
}

export async function signOutAction() {
  try {
    const supabase = await createActionClient()
    await supabase.auth.signOut()
    redirect("/")
  } catch (err) {
    console.error("Auth action error:", err)
    redirect("/")
  }
}

"use server"

import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import type { Provider } from "@supabase/supabase-js"
import { createServiceRoleClient } from "@/lib/supabase/admin"
import type { Role } from "@/lib/types/role"

interface AuthFormState {
  error?: string
  message?: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function createActionClient() {
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({
          name,
          value: "",
          ...options,
          maxAge: 0,
        })
      },
    },
  })
}

function getRedirectBase() {
  return headers().get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
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
  const supabase = createActionClient()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const role = (formData.get("role") as Role) || "guest"
  const redirectTo = `${getRedirectBase()}/auth/callback`

  if (!email || !password) {
    return { error: "Введите email и пароль" }
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
    return { error: error.message }
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
    message: "Подтвердите email, чтобы завершить регистрацию",
  }
}

export async function signInAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const supabase = createActionClient()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Введите email и пароль" }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const user = data.session?.user

  if (!user) {
    return { error: "Не удалось получить пользователя" }
  }

  const role = (await resolveUserRole(user.id)) ?? "guest"

  redirect(`/dashboard/${role}`)
}

export async function signInWithOAuthAction(provider: Provider) {
  const supabase = createActionClient()
  const redirectTo = `${getRedirectBase()}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  redirect("/auth/login")
}

export async function signOutAction() {
  const supabase = createActionClient()
  await supabase.auth.signOut()
  redirect("/")
}

"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser } from "@/hooks/use-user"
import { User } from "lucide-react"

export function UserMenu() {
  const router = useRouter()
  const supabase = createClient()
  const { user, role, isLoading } = useUser()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return <Button variant="ghost" size="icon" disabled />
  }

  if (!user) {
    return (
      <Button onClick={() => router.push("/auth/login")} className="bg-primary hover:bg-primary/90">
        Войти
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline text-sm font-medium">{user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{user.email}</p>
        </div>
        <DropdownMenuItem onClick={() => router.push(`/dashboard/${role ?? "guest"}`)}>
          Личный кабинет
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

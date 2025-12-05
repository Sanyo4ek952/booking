"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export function UserMenu() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <Button variant="ghost" size="icon" disabled />
  }

  if (!user) {
    return (
      <Button onClick={() => router.push("/auth/login")} className="bg-primary hover:bg-primary/90">
        Вход
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{user.email}</p>
        </div>
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>Личный кабинет</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

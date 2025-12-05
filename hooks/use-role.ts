"use client"

import type { Role } from "@/lib/types/role"
import { useUser } from "@/hooks/use-user"

interface UseRoleResult {
  user: any | null
  role: Role | null
  isGuest: boolean
  isHost: boolean
  isLoading: boolean
}

export function useRole(): UseRoleResult {
  const { user, role, isLoading } = useUser()

  return {
    user,
    role,
    isGuest: role === "guest",
    isHost: role === "host",
    isLoading,
  }
}

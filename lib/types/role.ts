export type Role = "guest" | "host"

export interface UserProfile {
  id: string
  email: string
  role: Role
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

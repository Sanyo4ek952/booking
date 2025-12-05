import { redirect } from "next/navigation"
import { getCurrentRole, getCurrentUser } from "@/lib/auth/server"

export default async function DashboardIndexPage() {
  const user = await getCurrentUser()
  const role = await getCurrentRole()

  if (!user) {
    redirect("/auth/login")
  }

  redirect(`/dashboard/${role ?? "guest"}`)
}

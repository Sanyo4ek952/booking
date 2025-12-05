import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { CreateListingForm } from "@/components/listing-form/create-listing-form"

export const metadata = {
  title: "Создать объявление",
  description: "Разместите своё жилье на нашей платформе",
}

export default async function CreateListingPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "host") {
    redirect("/dashboard/guest")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Создать объявление</h1>
        <p className="text-muted-foreground mb-8">Разместите своё жилье и начните зарабатывать</p>

        <CreateListingForm />
      </div>
    </main>
  )
}

import { redirect } from "next/navigation"
import { CreateListingForm } from "@/components/listing-form/create-listing-form"
import { getCurrentRole, getCurrentUser } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Создать объявление",
  description: "Разместите своё жилье на нашей платформе",
}

export default async function CreateListingPage() {
  const user = await getCurrentUser()
  const role = await getCurrentRole()

  if (!user) {
    redirect("/auth/login")
  }

  if (role !== "host") {
    redirect(`/dashboard/${role ?? "guest"}`)
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

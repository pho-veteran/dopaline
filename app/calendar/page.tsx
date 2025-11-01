"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CalendarView } from "@/components/CalendarView"
import { Navigation } from "@/components/Navigation"

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Calendar</h1>
        <CalendarView userId={session.user.id} />
        <div className="pb-20" />
        <Navigation />
      </div>
    </div>
  )
}


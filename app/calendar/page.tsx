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
      <div className="min-h-screen relative">
        <div className="glass-bg-gradient" />
        <div className="glass-bg-gradient-dark hidden dark:block" />
        <div className="flex min-h-screen items-center justify-center relative z-10">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen relative">
      <div className="glass-bg-gradient" />
      <div className="glass-bg-gradient-dark hidden dark:block" />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">Calendar</h1>
        <CalendarView userId={session.user.id} />
        <div className="pb-24" />
        <Navigation />
      </div>
    </div>
  )
}


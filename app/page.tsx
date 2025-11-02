"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { QuestList } from "@/components/QuestList"
import { TitleBadge } from "@/components/TitleBadge"
import { StreakCounter } from "@/components/StreakCounter"
import { DailySummary } from "@/components/DailySummary"
import { CalendarView } from "@/components/CalendarView"
import { BottomNavigation } from "@/components/BottomNavigation"
import { Card } from "@/components/ui/card"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [streak, setStreak] = useState(0)
  const [title, setTitle] = useState("Weakling")
  const [focusDone, setFocusDone] = useState(false)
  const [bodyDone, setBodyDone] = useState(false)
  const [noNutDone, setNoNutDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    // Only fetch when user ID actually changes, not on every session object update
    const userId = session?.user?.id
    if (userId && userId !== lastUserIdRef.current) {
      lastUserIdRef.current = userId
      fetchStreak()
      fetchQuests()
    }
  }, [session?.user?.id])

  useEffect(() => {
    const handleQuestCompleted = () => {
      fetchStreak()
      fetchQuests()
    }
    window.addEventListener("questCompleted", handleQuestCompleted)
    return () => window.removeEventListener("questCompleted", handleQuestCompleted)
  }, [])

  const fetchStreak = async () => {
    try {
      const response = await fetch("/api/streak")
      if (response.ok) {
        const data = await response.json()
        setStreak(data.streak)
        setTitle(data.title)
      }
    } catch (err) {
      console.error("Error fetching streak:", err)
    }
  }

  const fetchQuests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/daily-log")
      if (response.ok) {
        const data = await response.json()
        setFocusDone(data.dailyLog?.focusDone || false)
        setBodyDone(data.dailyLog?.bodyDone || false)
        setNoNutDone(data.dailyLog?.noNutDone || false)
      }
    } catch (err) {
      console.error("Error fetching quests:", err)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen relative">
        <div className="glass-bg-gradient" />
        <div className="glass-bg-gradient-dark hidden dark:block" />
        <div className="flex min-h-screen items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 pixel-border-lg bg-white/10 border-white/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 pixel-border-sm animate-pulse" />
                </div>
              </div>
            </div>
            <p className="text-white font-pixel pixel-text text-xl">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      <div className="glass-bg-gradient" />
      <div className="glass-bg-gradient-dark hidden dark:block" />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg font-pixel pixel-text">Welcome back</h1>
            <p className="text-white/80 font-pixel">Continue your journey to discipline</p>
          </div>

          <TitleBadge title={title} streak={streak} />

          <Card className="p-6 pixel-card-dark pixel-border">
            <StreakCounter streak={streak} />
          </Card>

          <QuestList userId={session.user.id} />

          <DailySummary focusDone={focusDone} bodyDone={bodyDone} noNutDone={noNutDone} />

          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg text-center font-pixel pixel-text">Calendar</h2>
            <CalendarView userId={session.user.id} />
          </div>
        </div>
        <div className="pb-24" />
        <BottomNavigation />
      </div>
    </div>
  )
}

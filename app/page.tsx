"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { QuestList } from "@/components/QuestList"
import { TitleBadge } from "@/components/TitleBadge"
import { StreakCounter } from "@/components/StreakCounter"
import { DailySummary } from "@/components/DailySummary"
import { Navigation } from "@/components/Navigation"
import { Card } from "@/components/ui/card"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [streak, setStreak] = useState(0)
  const [title, setTitle] = useState("Initiate")
  const [focusDone, setFocusDone] = useState(false)
  const [bodyDone, setBodyDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchStreak()
      fetchQuests()
    }
  }, [session])

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
          <div className="text-white">Loading...</div>
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
            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">Welcome back</h1>
            <p className="text-white/80">Continue your journey to discipline</p>
          </div>

          <TitleBadge title={title} streak={streak} />

          <Card className="p-6">
            <StreakCounter streak={streak} />
          </Card>

          <QuestList userId={session.user.id} />

          <DailySummary focusDone={focusDone} bodyDone={bodyDone} />
        </div>
        <div className="pb-24" />
        <Navigation />
      </div>
    </div>
  )
}

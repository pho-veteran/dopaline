"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { QuestList } from "@/components/QuestList"
import { TitleBadge } from "@/components/TitleBadge"
import { StreakCounter } from "@/components/StreakCounter"
import { DailySummary } from "@/components/DailySummary"
import { Navigation } from "@/components/Navigation"

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
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Continue your journey to discipline</p>
          </div>

          <TitleBadge title={title} streak={streak} />

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <StreakCounter streak={streak} />
          </div>

          <QuestList userId={session.user.id} />

          <DailySummary focusDone={focusDone} bodyDone={bodyDone} />
        </div>
        <div className="pb-20" />
        <Navigation />
      </div>
    </div>
  )
}

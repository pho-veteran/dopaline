"use client"

import { useEffect, useState } from "react"
import { QuestCard } from "./QuestCard"
import { NoNutCard } from "./NoNutCard"

interface Quest {
  id: string
  description: string
  difficulty: string
}

interface DailyLog {
  id: string
  focusDone: boolean
  bodyDone: boolean
  noNutDone: boolean
  focusRerolled: boolean
  bodyRerolled: boolean
}

interface QuestListProps {
  userId: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function QuestList({ userId: _userId }: QuestListProps) {
  const [focusQuest, setFocusQuest] = useState<Quest | null>(null)
  const [bodyQuest, setBodyQuest] = useState<Quest | null>(null)
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/daily-log")
      if (!response.ok) throw new Error("Failed to fetch quests")
      const data = await response.json()
      setFocusQuest(data.focusQuest)
      setBodyQuest(data.bodyQuest)
      setDailyLog(data.dailyLog)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuests()
  }, [])

  const handleComplete = async (questType: "focus" | "body" | "noNut") => {
    try {
      const response = await fetch("/api/daily-log/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questType }),
      })
      if (!response.ok) throw new Error("Failed to complete quest")
      await fetchQuests()
      // Trigger a custom event to refresh the dashboard
      window.dispatchEvent(new CustomEvent("questCompleted"))
    } catch (err) {
      console.error("Error completing quest:", err)
    }
  }

  const handleReroll = async (questType: "focus" | "body") => {
    try {
      const response = await fetch("/api/daily-log/reroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questType }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to reroll quest")
      }
      await fetchQuests()
    } catch (err) {
      console.error("Error rerolling quest:", err)
      alert(err instanceof Error ? err.message : "Failed to reroll quest")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading quests...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>
  }

  if (!focusQuest || !dailyLog) {
    return <div className="text-center py-8">No quests available</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <QuestCard
          quest={focusQuest}
          type="focus"
          isDone={dailyLog.focusDone}
          isRerolled={dailyLog.focusRerolled}
          onComplete={() => handleComplete("focus")}
          onReroll={() => handleReroll("focus")}
        />
        <QuestCard
          quest={bodyQuest}
          type="body"
          isDone={dailyLog.bodyDone}
          isRerolled={false}
          onComplete={() => handleComplete("body")}
          onReroll={() => handleReroll("body")}
        />
      </div>
      <NoNutCard
        isDone={dailyLog.noNutDone}
        onComplete={() => handleComplete("noNut")}
      />
    </div>
  )
}


"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, RefreshCw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestCardProps {
  quest: {
    id: string
    description: string
    difficulty: string
  } | null
  type: "focus" | "body"
  isDone: boolean
  isRerolled: boolean
  onComplete: () => Promise<void>
  onReroll: () => Promise<void>
}

export function QuestCard({ quest, type, isDone, isRerolled, onComplete, onReroll }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isRerolling, setIsRerolling] = useState(false)

  const handleComplete = async () => {
    if (isDone || isCompleting) return
    setIsCompleting(true)
    try {
      await onComplete()
    } finally {
      setIsCompleting(false)
    }
  }

  const handleReroll = async () => {
    if (isDone || isRerolled || isRerolling || type === "body") return
    setIsRerolling(true)
    try {
      await onReroll()
    } finally {
      setIsRerolling(false)
    }
  }

  const typeColors = {
    focus: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
    body: "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-100",
  }

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  // Body quests show a simple exercise check UI
  if (type === "body") {
    return (
      <Card
        className={cn(
          "transition-all duration-300",
          isDone && "opacity-75 scale-[0.98]",
          typeColors[type]
        )}
      >
        <CardHeader>
          <CardTitle className="text-lg">Exercise Check</CardTitle>
          <CardDescription className="text-base mt-2">
            Did you exercise today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleComplete}
            disabled={isDone || isCompleting}
            className={cn(
              "w-full",
              isDone && "bg-green-600 hover:bg-green-700"
            )}
            size="lg"
          >
            {isCompleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isDone ? (
              <Check className="h-4 w-4 mr-2" />
            ) : null}
            {isDone ? "Exercise Completed" : "Mark Exercise Complete"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Focus quests show full quest details with reroll
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isDone && "opacity-75 scale-[0.98]",
        typeColors[type]
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg capitalize">{type} Quest</CardTitle>
          {quest && (
            <Badge className={cn("capitalize", difficultyColors[quest.difficulty as keyof typeof difficultyColors])}>
              {quest.difficulty}
            </Badge>
          )}
        </div>
        <CardDescription className="text-base mt-2">{quest?.description || "Loading..."}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button
          onClick={handleComplete}
          disabled={isDone || isCompleting}
          className={cn(
            "flex-1",
            isDone && "bg-green-600 hover:bg-green-700"
          )}
        >
          {isCompleting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : isDone ? (
            <Check className="h-4 w-4 mr-2" />
          ) : null}
          {isDone ? "Completed" : "Complete"}
        </Button>
        <Button
          onClick={handleReroll}
          disabled={isDone || isRerolled || isRerolling}
          variant="outline"
          size="icon"
          title="Reroll quest"
        >
          {isRerolling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  )
}


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
    focus: "bg-blue-500/20 border-blue-400/30 text-white backdrop-blur-sm",
    body: "bg-orange-500/20 border-orange-400/30 text-white backdrop-blur-sm",
  }

  const difficultyColors = {
    easy: "bg-green-500/30 text-white border-green-400/40 backdrop-blur-sm",
    medium: "bg-yellow-500/30 text-white border-yellow-400/40 backdrop-blur-sm",
    hard: "bg-red-500/30 text-white border-red-400/40 backdrop-blur-sm",
  }

  // Body quests show a simple exercise check UI
  if (type === "body") {
    return (
      <Card
        className={cn(
          "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
          isDone && "opacity-75 scale-[0.98] glow-blue",
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
              isDone && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
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
            isDone && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
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


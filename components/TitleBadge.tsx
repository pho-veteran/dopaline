"use client"

import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface TitleBadgeProps {
  title: string
  streak: number
}

export function TitleBadge({ title, streak }: TitleBadgeProps) {
  const milestones = [3, 7, 14, 21, 30]
  const nextMilestone = milestones.find((m) => m > streak) || 30

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <Badge className="text-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {title}
        </Badge>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold">{streak}</p>
        <p className="text-sm text-muted-foreground">day streak</p>
        <p className="text-xs text-muted-foreground mt-2">
          {nextMilestone - streak} days until next milestone
        </p>
      </div>
    </div>
  )
}


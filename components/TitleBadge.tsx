"use client"

import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface TitleBadgeProps {
  title: string
  streak: number
}

export function TitleBadge({ title, streak }: TitleBadgeProps) {
  const milestones = [3, 7, 14, 21, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365]
  const nextMilestone = milestones.find((m) => m > streak) || 365

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Trophy className="h-10 w-10 text-yellow-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-yellow-400/50 blur-xl -z-10" />
        </div>
        <Badge className="text-2xl px-6 py-3 font-pixel pixel-border-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
          {title}
        </Badge>
      </div>
      <div className="text-center">
        <p className="text-4xl font-pixel font-bold text-white pixel-text">{streak}</p>
        <p className="text-sm text-white/80 font-pixel mt-1">day streak</p>
        <p className="text-xs text-white/60 mt-2 font-pixel">
          {nextMilestone - streak} days until next milestone
        </p>
      </div>
    </div>
  )
}


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
        <div className="relative">
          <Trophy className="h-8 w-8 text-yellow-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-yellow-400/50 blur-xl -z-10" />
        </div>
        <Badge className="text-2xl px-6 py-3 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-white/30 text-white shadow-lg glow-purple">
          {title}
        </Badge>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-white drop-shadow-lg">{streak}</p>
        <p className="text-sm text-white/80">day streak</p>
        <p className="text-xs text-white/60 mt-2">
          {nextMilestone - streak} days until next milestone
        </p>
      </div>
    </div>
  )
}


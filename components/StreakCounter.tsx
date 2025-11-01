"use client"

import { Progress } from "@/components/ui/progress"

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const milestones = [7, 14, 21, 30]
  const nextMilestone = milestones.find((m) => m > streak) || 30
  const progress = (streak / nextMilestone) * 100

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress to next milestone</span>
        <span className="font-medium">{streak} / {nextMilestone}</span>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {milestones.map((milestone) => (
            <span key={milestone}>{milestone}</span>
          ))}
        </div>
      </div>
    </div>
  )
}


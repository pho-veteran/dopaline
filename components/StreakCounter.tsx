"use client"

import { Progress } from "@/components/ui/progress"

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const milestones = [7, 14, 21, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365]
  const nextMilestone = milestones.find((m) => m > streak) || 365
  const progress = (streak / nextMilestone) * 100

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-white/80 font-pixel">Progress to next milestone</span>
        <span className="font-medium text-white font-pixel">{streak} / {nextMilestone}</span>
      </div>
      <div className="relative">
        <div className="pixel-progress h-6 bg-white/10">
          <div 
            className="pixel-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/60 font-pixel">
          {milestones.map((milestone) => (
            <span key={milestone}>{milestone}</span>
          ))}
        </div>
      </div>
    </div>
  )
}


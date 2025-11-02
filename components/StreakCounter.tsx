"use client"

import { Progress } from "@/components/ui/progress"

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const allMilestones = [7, 14, 21, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365]
  const nextMilestone = allMilestones.find((m) => m > streak) || 365
  const progress = (streak / nextMilestone) * 100

  // Show only relevant milestones: current, next, and a few upcoming ones
  const nextIndex = allMilestones.indexOf(nextMilestone)
  const relevantMilestones = allMilestones.slice(
    Math.max(0, nextIndex - 2),
    Math.min(allMilestones.length, nextIndex + 4)
  )

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <span className="text-white/80 font-pixel text-sm sm:text-base">Progress to next milestone</span>
        <span className="font-medium text-white font-pixel text-base sm:text-lg">
          {streak} / {nextMilestone}
        </span>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <div className="pixel-progress h-6 sm:h-8 bg-white/10">
            <div 
              className="pixel-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 sm:gap-1">
          {relevantMilestones.map((milestone) => {
            const isAchieved = streak >= milestone
            const isNext = milestone === nextMilestone
            return (
              <div
                key={milestone}
                className={`flex flex-col items-center px-2 sm:px-1 ${
                  isNext ? "scale-110" : ""
                }`}
              >
        <span
          className={`font-pixel text-sm sm:text-xs ${
            isAchieved
              ? "text-green-400 font-bold"
              : isNext
              ? "text-blue-400 font-semibold"
              : "text-white/50"
          }`}
        >
          {milestone}
        </span>
                {isNext && (
                  <div className="w-1 h-1 sm:w-0.5 sm:h-0.5 bg-blue-400 rounded-full mt-0.5" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


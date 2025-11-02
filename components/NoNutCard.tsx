"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface NoNutCardProps {
  isDone: boolean
  onComplete: () => Promise<void>
}

function isInTimeWindow(): boolean {
  const now = new Date()
  const hour = now.getHours()
  // 9pm (21) to 12am (0) - note: 12am is 0, so we check hour >= 21 OR hour < 1 (midnight)
  return hour >= 21 || hour < 1
}

export function NoNutCard({ isDone, onComplete }: NoNutCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    setIsAvailable(isInTimeWindow())
    // Check every minute
    const interval = setInterval(() => {
      setIsAvailable(isInTimeWindow())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleComplete = async () => {
    if (isDone || isCompleting || !isAvailable) return
    setIsCompleting(true)
    try {
      await onComplete()
    } finally {
      setIsCompleting(false)
    }
  }

  if (!isAvailable && !isDone) {
    return (
      <Card className="pixel-card-dark pixel-border transition-all duration-300 opacity-60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-pixel text-white">No Nut Challenge</CardTitle>
            <Lock className="h-5 w-5 text-white/60" />
          </div>
          <CardDescription className="text-base mt-2 text-white/60 font-pixel">
            Available from 9 PM to 12 AM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            disabled
            variant="pixel"
            className="w-full font-pixel opacity-50 cursor-not-allowed"
            size="lg"
          >
            <Lock className="h-4 w-4 mr-2" />
            Locked
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "pixel-card-dark pixel-border transition-all duration-300 hover:scale-[1.02]",
        isDone && "opacity-75 scale-[0.98]"
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-pixel text-white">No Nut Challenge</CardTitle>
        <CardDescription className="text-base mt-2 text-white/80 font-pixel">
          Confirm you stayed strong today (9 PM - 12 AM only)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleComplete}
          disabled={isDone || isCompleting}
          variant={isDone ? "pixelSuccess" : "pixel"}
          className="w-full font-pixel"
          size="lg"
        >
          {isCompleting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : isDone ? (
            <Check className="h-4 w-4 mr-2" />
          ) : null}
          {isDone ? "Confirmed" : "Confirm No Nut"}
        </Button>
      </CardContent>
    </Card>
  )
}


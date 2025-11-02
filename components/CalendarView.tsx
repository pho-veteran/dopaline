"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getMonth, getYear } from "date-fns"
import { cn } from "@/lib/utils"

interface DailyLog {
  id: string
  date: string
  focusDone: boolean
  bodyDone: boolean
  noNutDone: boolean
}

interface CalendarViewProps {
  userId: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CalendarView({ userId: _userId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)

  const month = getMonth(currentDate)
  const year = getYear(currentDate)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/calendar?year=${year}&month=${month}`)
        if (!response.ok) throw new Error("Failed to fetch calendar")
        const data = await response.json()
        setDailyLogs(data)
      } catch (err) {
        console.error("Error fetching calendar:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [year, month])

  const getDayStatus = (day: Date) => {
    const log = dailyLogs.find((l) => isSameDay(new Date(l.date), day))
    if (!log) return "missed"
    if (log.focusDone && log.bodyDone && log.noNutDone) return "perfect"
    if (log.focusDone || log.bodyDone || log.noNutDone) return "partial"
    return "missed"
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <Card className="pixel-card-dark pixel-border hover:scale-[1.01] transition-transform duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="pixel" size="icon" onClick={previousMonth} className="text-white font-pixel">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-white font-pixel">{format(currentDate, "MMMM yyyy")}</CardTitle>
          <Button variant="pixel" size="icon" onClick={nextMonth} className="text-white font-pixel">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-white/80 font-pixel">Loading...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-white/80 py-2 font-pixel">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const status = getDayStatus(day)
              const isToday = isSameDay(day, new Date())
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm font-medium transition-all duration-300 font-pixel pixel-border-sm",
                    status === "perfect" && "bg-blue-500 text-white pixel-border-light",
                    status === "partial" && "bg-orange-500 text-white pixel-border-light",
                    status === "missed" && "bg-white/10 text-white/60 border-white/30 hover:bg-white/20",
                    isToday && "ring-4 ring-blue-400 ring-offset-2 scale-110"
                  )}
                >
                  {format(day, "d")}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


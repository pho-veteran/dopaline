"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TitleBadge } from "@/components/TitleBadge"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/BottomNavigation"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [streak, setStreak] = useState(0)
  const [title, setTitle] = useState("Weakling")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const fetchStreak = useCallback(async () => {
    try {
      const response = await fetch("/api/streak")
      if (response.ok) {
        const data = await response.json()
        setStreak(data.streak)
        setTitle(data.title)
      }
    } catch (err) {
      console.error("Error fetching streak:", err)
    }
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStreak()
    }
  }, [session, fetchStreak])

  if (status === "loading") {
    return (
      <div className="min-h-screen relative">
        <div className="glass-bg-gradient" />
        <div className="glass-bg-gradient-dark hidden dark:block" />
      <div className="flex min-h-screen items-center justify-center relative z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 pixel-border-lg bg-white/10 border-white/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 pixel-border-sm animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-white font-pixel pixel-text text-xl">Loading...</p>
        </div>
      </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const titleMilestones = [
    { streak: 0, title: "Weakling" },
    { streak: 1, title: "Pathetic Attempt" },
    { streak: 3, title: "Still Struggling" },
    { streak: 7, title: "Barely Trying" },
    { streak: 14, title: "Self-Controller" },
    { streak: 21, title: "Discipline Novice" },
    { streak: 30, title: "Dopamine Monk" },
    { streak: 45, title: "Willpower Disciple" },
    { streak: 60, title: "Ascetic Apprentice" },
    { streak: 90, title: "Self-Mastery Student" },
    { streak: 120, title: "Discipline Adept" },
    { streak: 150, title: "Mind-Body Sage" },
    { streak: 180, title: "Dopamine Warrior" },
    { streak: 210, title: "Willpower Champion" },
    { streak: 240, title: "Ascetic Master" },
    { streak: 270, title: "Self-Mastery Grandmaster" },
    { streak: 300, title: "Discipline Legend" },
    { streak: 330, title: "Transcendent Monk" },
    { streak: 365, title: "Dopamine God" },
  ]

  return (
    <div className="min-h-screen relative">
      <div className="glass-bg-gradient" />
      <div className="glass-bg-gradient-dark hidden dark:block" />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg font-pixel pixel-text">You</h1>
            <Button variant="pixel" onClick={() => signOut({ callbackUrl: "/login" })} className="font-pixel">
              Sign Out
            </Button>
          </div>

          <Card className="pixel-card-dark pixel-border">
            <CardHeader>
              <CardTitle className="text-white font-pixel">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <TitleBadge title={title} streak={streak} />
            </CardContent>
          </Card>

          <Card className="pixel-card-dark pixel-border">
            <CardHeader>
              <CardTitle className="text-white font-pixel">Title Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {titleMilestones.map((milestone) => (
                  <div
                    key={milestone.streak}
                    className={cn(
                      "flex items-center justify-between p-4 pixel-border-sm transition-all font-pixel",
                      streak >= milestone.streak
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white/80"
                    )}
                  >
                    <div>
                      <p className="font-semibold font-pixel">{milestone.title}</p>
                      <p className="text-sm text-white/60 font-pixel">
                        {milestone.streak} day{milestone.streak !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {streak >= milestone.streak && (
                      <span className="text-white font-pixel">✓ Achieved</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {session.user && (
            <Card className="pixel-card-dark pixel-border">
              <CardHeader>
                <CardTitle className="text-white font-pixel">Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-white/90 font-pixel">
                    <span className="font-medium">Email:</span> {session.user.email}
                  </p>
                  {session.user.name && (
                    <p className="text-white/90 font-pixel">
                      <span className="font-medium">Name:</span> {session.user.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="pb-24" />
        <BottomNavigation />
      </div>
    </div>
  )
}


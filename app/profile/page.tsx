"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TitleBadge } from "@/components/TitleBadge"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/Navigation"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [streak, setStreak] = useState(0)
  const [title, setTitle] = useState("Initiate")

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
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const titleMilestones = [
    { streak: 1, title: "Initiate" },
    { streak: 3, title: "Self-Controller" },
    { streak: 7, title: "Discipline Novice" },
    { streak: 14, title: "Focus Warrior" },
    { streak: 21, title: "Mind-Body Knight" },
    { streak: 30, title: "Dopamine Monk" },
  ]

  return (
    <div className="min-h-screen relative">
      <div className="glass-bg-gradient" />
      <div className="glass-bg-gradient-dark hidden dark:block" />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Profile</h1>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
              Sign Out
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-white">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <TitleBadge title={title} streak={streak} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-white">Title Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {titleMilestones.map((milestone) => (
                  <div
                    key={milestone.streak}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border border-white/20 transition-all",
                      streak >= milestone.streak
                        ? "bg-green-500/20 text-white shadow-lg"
                        : "bg-white/10 text-white/80"
                    )}
                  >
                    <div>
                      <p className="font-semibold">{milestone.title}</p>
                      <p className="text-sm text-white/60">
                        {milestone.streak} day{milestone.streak !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {streak >= milestone.streak && (
                      <span className="text-green-300">✓ Achieved</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {session.user && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-white/90">
                    <span className="font-medium">Email:</span> {session.user.email}
                  </p>
                  {session.user.name && (
                    <p className="text-white/90">
                      <span className="font-medium">Name:</span> {session.user.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="pb-24" />
        <Navigation />
      </div>
    </div>
  )
}


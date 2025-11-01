"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TitleBadge } from "@/components/TitleBadge"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/Navigation"

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
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Profile</h1>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
              Sign Out
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <TitleBadge title={title} streak={streak} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Title Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {titleMilestones.map((milestone) => (
                  <div
                    key={milestone.streak}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      streak >= milestone.streak
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{milestone.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {milestone.streak} day{milestone.streak !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {streak >= milestone.streak && (
                      <span className="text-green-600 dark:text-green-400">✓ Achieved</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {session.user && (
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Email:</span> {session.user.email}
                  </p>
                  {session.user.name && (
                    <p>
                      <span className="font-medium">Name:</span> {session.user.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="pb-20" />
        <Navigation />
      </div>
    </div>
  )
}


"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <Card className="shadow-2xl hover:scale-[1.02] transition-transform duration-300">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">Dopaline</CardTitle>
        <CardDescription className="text-base text-white/80">
          Build discipline through daily quests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full"
          size="lg"
        >
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  )
}


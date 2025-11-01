"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold">Dopaline</CardTitle>
        <CardDescription className="text-base">
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


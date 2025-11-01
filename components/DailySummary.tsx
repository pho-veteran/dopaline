"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getRandomQuote, getRandomReflectionPrompt } from "@/lib/quotes"
import { useState } from "react"

interface DailySummaryProps {
  focusDone: boolean
  bodyDone: boolean
}

export function DailySummary({ focusDone, bodyDone }: DailySummaryProps) {
  const [quote, setQuote] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)
  const isPerfect = focusDone && bodyDone

  const handleShowMessage = () => {
    if (isPerfect) {
      setQuote(getRandomQuote())
    } else {
      setPrompt(getRandomReflectionPrompt())
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
        <CardDescription>
          {isPerfect
            ? "Congratulations! You completed both quests today."
            : "You haven't completed all quests yet. Keep going!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPerfect ? (
          <div className="space-y-4">
            <p className="text-lg italic text-center text-muted-foreground">
              &ldquo;{quote || getRandomQuote()}&rdquo;
            </p>
            <Button onClick={handleShowMessage} variant="outline" className="w-full">
              Show Another Quote
            </Button>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" onClick={handleShowMessage}>
                Reflect on Today
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Daily Reflection</DialogTitle>
                <DialogDescription>
                  {prompt || getRandomReflectionPrompt()}
                </DialogDescription>
              </DialogHeader>
              <textarea
                className="w-full min-h-[120px] p-3 border rounded-md"
                placeholder="Write your reflection here..."
              />
              <Button>Save Reflection</Button>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}


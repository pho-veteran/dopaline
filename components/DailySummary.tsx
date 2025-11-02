"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getRandomQuote, getRandomReflectionPrompt } from "@/lib/quotes"
import { useState } from "react"

interface DailySummaryProps {
  focusDone: boolean
  bodyDone: boolean
  noNutDone: boolean
}

export function DailySummary({ focusDone, bodyDone, noNutDone }: DailySummaryProps) {
  const [quote, setQuote] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)
  const isPerfect = focusDone && bodyDone && noNutDone

  const handleShowMessage = () => {
    if (isPerfect) {
      setQuote(getRandomQuote())
    } else {
      setPrompt(getRandomReflectionPrompt())
    }
  }

  return (
    <Card className="mt-6 pixel-card-dark pixel-border hover:scale-[1.01] transition-transform duration-300">
      <CardHeader>
        <CardTitle className="text-white font-pixel">Daily Summary</CardTitle>
        <CardDescription className="text-white/80 font-pixel">
          {isPerfect
            ? "Congratulations! You completed all quests today."
            : "You haven't completed all quests yet. Keep going!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPerfect ? (
          <div className="space-y-4">
            <p className="text-lg italic text-center text-white/90 drop-shadow-md font-pixel">
              &ldquo;{quote || getRandomQuote()}&rdquo;
            </p>
            <Button onClick={handleShowMessage} variant="pixel" className="w-full font-pixel">
              Show Another Quote
            </Button>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="pixel" className="w-full font-pixel" onClick={handleShowMessage}>
                Reflect on Today
              </Button>
            </DialogTrigger>
            <DialogContent className="pixel-card-dark pixel-border">
              <DialogHeader>
                <DialogTitle className="font-pixel">Daily Reflection</DialogTitle>
                <DialogDescription className="font-pixel">
                  {prompt || getRandomReflectionPrompt()}
                </DialogDescription>
              </DialogHeader>
              <textarea
                className="w-full min-h-[120px] p-3 pixel-border-sm bg-white/10 text-white placeholder:text-white/50 font-pixel"
                placeholder="Write your reflection here..."
              />
              <Button variant="pixel" className="font-pixel">Save Reflection</Button>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}


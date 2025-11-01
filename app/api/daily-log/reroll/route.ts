import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { rerollQuest } from "@/lib/quests"
import { z } from "zod"

const rerollQuestSchema = z.object({
  questType: z.enum(["focus", "body"]),
  date: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { questType, date } = rerollQuestSchema.parse(body)

    const targetDate = date ? new Date(date) : undefined
    const result = await rerollQuest(session.user.id, questType, targetDate)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Error rerolling quest:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}


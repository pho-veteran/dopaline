import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getQuestsForUser } from "@/lib/quests"
import { getTodayUTC } from "@/lib/dates"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")
    const date = dateParam ? new Date(dateParam) : getTodayUTC()

    const result = await getQuestsForUser(session.user.id, date)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching daily log:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { date } = await request.json()
    const targetDate = date ? new Date(date) : getTodayUTC()

    const result = await getQuestsForUser(session.user.id, targetDate)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating daily log:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}


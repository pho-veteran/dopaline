import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { getMonthDates } from "@/lib/dates"

const calendarQuerySchema = z.object({
  year: z.string().transform(Number),
  month: z.string().transform(Number),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get("year")
    const monthParam = searchParams.get("month")

    if (!yearParam || !monthParam) {
      return NextResponse.json({ error: "Year and month required" }, { status: 400 })
    }

    const { year, month } = calendarQuerySchema.parse({
      year: yearParam,
      month: monthParam,
    })

    const dates = getMonthDates(year, month)
    const startDate = dates[0]
    const endDate = dates[dates.length - 1]

    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(dailyLogs)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Error fetching calendar:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}


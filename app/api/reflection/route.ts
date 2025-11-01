import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { normalizeDate, getTodayUTC } from "@/lib/dates"

const reflectionSchema = z.object({
  content: z.string().min(1),
  date: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, date } = reflectionSchema.parse(body)

    const targetDate = date ? normalizeDate(new Date(date)) : getTodayUTC()

    const reflection = await prisma.reflection.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: targetDate,
        },
      },
      update: {
        content,
      },
      create: {
        userId: session.user.id,
        date: targetDate,
        content,
      },
    })

    return NextResponse.json(reflection)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Error saving reflection:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}


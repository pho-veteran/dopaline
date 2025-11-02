import { prisma } from "./prisma"
import { normalizeDate, getTodayUTC } from "./dates"

const TITLE_MILESTONES = [
  { streak: 0, title: "Weakling" },
  { streak: 1, title: "Pathetic Attempt" },
  { streak: 3, title: "Still Struggling" },
  { streak: 7, title: "Barely Trying" },
  { streak: 14, title: "Self-Controller" },
  { streak: 21, title: "Discipline Novice" },
  { streak: 30, title: "Dopamine Monk" },
  { streak: 45, title: "Willpower Disciple" },
  { streak: 60, title: "Ascetic Apprentice" },
  { streak: 90, title: "Self-Mastery Student" },
  { streak: 120, title: "Discipline Adept" },
  { streak: 150, title: "Mind-Body Sage" },
  { streak: 180, title: "Dopamine Warrior" },
  { streak: 210, title: "Willpower Champion" },
  { streak: 240, title: "Ascetic Master" },
  { streak: 270, title: "Self-Mastery Grandmaster" },
  { streak: 300, title: "Discipline Legend" },
  { streak: 330, title: "Transcendent Monk" },
  { streak: 365, title: "Dopamine God" },
]

export function getTitleForStreak(streak: number): string {
  let title = "Weakling"
  for (const milestone of TITLE_MILESTONES) {
    if (streak >= milestone.streak) {
      title = milestone.title
    } else {
      break
    }
  }
  return title
}

export async function calculateStreak(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      dailyLogs: {
        where: {
          focusDone: true,
          bodyDone: true,
          noNutDone: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  })

  if (!user || !user.dailyLogs.length) {
    return 0
  }

  const today = getTodayUTC()
  let streak = 0
  let checkDate = normalizeDate(new Date(today))

  // Create a map of completed dates for quick lookup
  const completedDates = new Set(
    user.dailyLogs.map((log: { date: Date }) => normalizeDate(log.date).toISOString())
  )

  // Check consecutive days starting from today going backwards
  while (completedDates.has(checkDate.toISOString())) {
    streak++
    // Move to previous day
    checkDate = new Date(checkDate)
    checkDate.setDate(checkDate.getDate() - 1)
    checkDate = normalizeDate(checkDate)
    
    // Prevent infinite loop (safety check)
    if (streak > 1000) break
  }

  return streak
}

export async function updateStreak(userId: string): Promise<{ streak: number; title: string }> {
  const streak = await calculateStreak(userId)
  const title = getTitleForStreak(streak)

  await prisma.user.update({
    where: { id: userId },
    data: {
      streak,
      title,
      lastCompletedDate: getTodayUTC(),
    },
  })

  return { streak, title }
}

export async function updateUserTitle(userId: string): Promise<string> {
  const streak = await calculateStreak(userId)
  const title = getTitleForStreak(streak)

  await prisma.user.update({
    where: { id: userId },
    data: { title },
  })

  return title
}


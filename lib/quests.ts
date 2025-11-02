import { prisma } from "./prisma"
import { getTodayUTC, normalizeDate } from "./dates"

export async function getQuestsForUser(userId: string, date: Date = getTodayUTC()) {
  const normalizedDate = normalizeDate(date)

  let dailyLog = await prisma.dailyLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    include: {
      user: true,
    },
  })

  if (!dailyLog) {
    await generateDailyQuests(userId, normalizedDate)
    // Fetch with user relation after creation
    dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: normalizedDate,
        },
      },
      include: {
        user: true,
      },
    })
    if (!dailyLog) {
      throw new Error("Failed to create daily log")
    }
  }

  const [focusQuest, bodyQuest] = await Promise.all([
    prisma.quest.findUnique({ where: { id: dailyLog.focusQuestId } }),
    prisma.quest.findUnique({ where: { id: dailyLog.bodyQuestId } }),
  ])

  return {
    dailyLog,
    focusQuest,
    bodyQuest,
  }
}

export async function generateDailyQuests(userId: string, date: Date) {
  // Get random focus quest from pool
  const focusQuests = await prisma.quest.findMany({
    where: { type: "focus" },
  })

  // Get the single body quest (placeholder for exercise check)
  const bodyQuest = await prisma.quest.findFirst({
    where: { type: "body" },
  })

  if (focusQuests.length === 0) {
    throw new Error("No focus quests available. Please seed the database.")
  }

  if (!bodyQuest) {
    throw new Error("Body quest not found. Please seed the database.")
  }

  const randomFocus = focusQuests[Math.floor(Math.random() * focusQuests.length)]

  const dailyLog = await prisma.dailyLog.create({
    data: {
      userId,
      date,
      focusQuestId: randomFocus.id,
      bodyQuestId: bodyQuest.id, // Always use the same placeholder body quest
    },
  })

  return dailyLog
}

export async function rerollQuest(
  userId: string,
  questType: "focus" | "body",
  date: Date = getTodayUTC()
) {
  const normalizedDate = normalizeDate(date)

  // Body quests cannot be rerolled (they're just exercise check)
  if (questType === "body") {
    throw new Error("Body quest (exercise check) cannot be rerolled")
  }

  const dailyLog = await prisma.dailyLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
  })

  if (!dailyLog) {
    throw new Error("Daily log not found")
  }

  // Check if quest is already completed
  if (dailyLog.focusDone) {
    throw new Error("Cannot reroll completed quest")
  }

  // Check if already rerolled
  if (dailyLog.focusRerolled) {
    throw new Error("Quest already rerolled today")
  }

  // Get new focus quest
  const focusQuests = await prisma.quest.findMany({
    where: { type: "focus" },
  })

  if (focusQuests.length === 0) {
    throw new Error("No focus quests available")
  }

  const availableQuests = focusQuests.filter((q: { id: string }) => q.id !== dailyLog.focusQuestId)

  if (availableQuests.length === 0) {
    throw new Error("No alternative quests available")
  }

  const newQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)]

  const updated = await prisma.dailyLog.update({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    data: {
      focusQuestId: newQuest.id,
      focusRerolled: true,
    },
  })

  return updated
}

export async function completeQuest(
  userId: string,
  questType: "focus" | "body" | "noNut",
  date: Date = getTodayUTC()
) {
  const normalizedDate = normalizeDate(date)

  const dailyLog = await prisma.dailyLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
  })

  if (!dailyLog) {
    throw new Error("Daily log not found")
  }

  const isAlreadyDone = questType === "focus" 
    ? dailyLog.focusDone 
    : questType === "body"
    ? dailyLog.bodyDone
    : dailyLog.noNutDone
  
  if (isAlreadyDone) {
    return dailyLog
  }

  const updateField = questType === "focus" 
    ? "focusDone"
    : questType === "body"
    ? "bodyDone"
    : "noNutDone"

  const updated = await prisma.dailyLog.update({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    data: {
      [updateField]: true,
    },
  })

  // Check if all quests are done, then update streak
  const allDone = updated.focusDone && updated.bodyDone && updated.noNutDone
  if (allDone) {
    const { updateStreak } = await import("./streaks")
    await updateStreak(userId)
  }

  return updated
}


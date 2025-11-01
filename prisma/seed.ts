import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { resolve } from "path"

// Load environment variables from the project root
config({ path: resolve(process.cwd(), ".env") })

// Check if DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set in environment variables!")
  console.error("Please ensure your .env file exists and contains DATABASE_URL")
  process.exit(1)
}

const prisma = new PrismaClient()

const focusQuests = [
  // LeetCode Problems - Easy
  { type: "focus", difficulty: "easy", description: "Solve 1 LeetCode easy problem" },
  { type: "focus", difficulty: "easy", description: "Solve 2 LeetCode easy problems" },
  { type: "focus", difficulty: "easy", description: "Solve 3 LeetCode easy problems" },
  
  // LeetCode Problems - Medium
  { type: "focus", difficulty: "medium", description: "Solve 1 LeetCode medium problem" },
  { type: "focus", difficulty: "medium", description: "Solve 2 LeetCode medium problems" },
  { type: "focus", difficulty: "medium", description: "Solve 1 LeetCode medium + 2 easy problems" },
  
  // LeetCode Problems - Hard
  { type: "focus", difficulty: "hard", description: "Solve 1 LeetCode hard problem" },
  { type: "focus", difficulty: "hard", description: "Solve 2 LeetCode medium problems" },
  { type: "focus", difficulty: "hard", description: "Solve 1 LeetCode hard + 1 medium problem" },
  
  // Complete Project Todos - Easy
  { type: "focus", difficulty: "easy", description: "Complete at least 2 todos for a project" },
  { type: "focus", difficulty: "easy", description: "Complete at least 3 todos for a project" },
  { type: "focus", difficulty: "easy", description: "Complete at least 2 todos and review code" },
  
  // Complete Project Todos - Medium
  { type: "focus", difficulty: "medium", description: "Complete at least 4 todos for a project" },
  { type: "focus", difficulty: "medium", description: "Complete at least 5 todos for a project" },
  { type: "focus", difficulty: "medium", description: "Complete at least 3 todos and write tests" },
  
  // Complete Project Todos - Hard
  { type: "focus", difficulty: "hard", description: "Complete at least 6 todos for a project" },
  { type: "focus", difficulty: "hard", description: "Complete at least 8 todos for a project" },
  { type: "focus", difficulty: "hard", description: "Complete at least 5 todos and refactor code" },
  
  // Learn New Skill - Easy
  { type: "focus", difficulty: "easy", description: "Learn a new skill for 15 minutes" },
  { type: "focus", difficulty: "easy", description: "Learn a new skill for 20 minutes" },
  { type: "focus", difficulty: "easy", description: "Learn a new skill for 30 minutes" },
  
  // Learn New Skill - Medium
  { type: "focus", difficulty: "medium", description: "Learn a new skill for 45 minutes" },
  { type: "focus", difficulty: "medium", description: "Learn a new skill for 1 hour" },
  { type: "focus", difficulty: "medium", description: "Learn a new skill for 1.5 hours" },
  
  // Learn New Skill - Hard
  { type: "focus", difficulty: "hard", description: "Learn a new skill for 2 hours" },
  { type: "focus", difficulty: "hard", description: "Learn a new skill for 3 hours" },
  { type: "focus", difficulty: "hard", description: "Learn a new skill and build a small project" },
]

// Single placeholder quest for body (exercise check)
const bodyQuest = {
  type: "body",
  difficulty: "easy",
  description: "Did you exercise today?",
}

async function main() {
  console.log("Seeding database...")

  // Clear existing quests
  await prisma.quest.deleteMany({})
  console.log("Cleared existing quests")

  // Create focus quests
  for (const quest of focusQuests) {
    await prisma.quest.create({
      data: quest,
    })
  }
  console.log(`Created ${focusQuests.length} code-related focus quests`)

  // Create single placeholder body quest (for exercise check)
  await prisma.quest.create({
    data: bodyQuest,
  })
  console.log("Created placeholder body quest (exercise check)")

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


export const motivationalQuotes = [
  "Discipline is choosing between what you want now and what you want most.",
  "The only bad workout is the one that didn't happen.",
  "Small steps every day lead to big changes over time.",
  "Your future self is counting on you today.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "The pain you feel today is the strength you feel tomorrow.",
  "Motivation gets you started. Discipline keeps you going.",
  "You don't have to be great to start, but you have to start to be great.",
  "The journey of a thousand miles begins with a single step.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You are one workout away from a good mood.",
  "Discipline is the bridge between goals and accomplishment.",
  "Consistency is what transforms average into excellence.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The only way to do great work is to love what you do.",
  "It's not about having time, it's about making time.",
  "The difference between try and triumph is a little 'umph'.",
  "Be stronger than your excuses.",
  "Every accomplishment starts with the decision to try.",
  "Do something today that your future self will thank you for.",
]

export const reflectionPrompts = [
  "What prevented you from completing your quests today?",
  "How can you better prepare for tomorrow?",
  "What small change could make a big difference?",
  "What's one thing you learned about yourself today?",
  "What would help you stay more consistent?",
  "What motivated you the most this week?",
  "What challenge are you most proud of overcoming?",
]

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
}

export function getRandomReflectionPrompt(): string {
  return reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
}


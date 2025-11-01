import { startOfDay, isSameDay, format } from "date-fns"

export function getTodayUTC(): Date {
  return startOfDay(new Date())
}

export function normalizeDate(date: Date): Date {
  return startOfDay(date)
}

export function isSameDayUTC(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2)
}

export function formatDateForCalendar(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function getMonthDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const dates: Date[] = []
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d))
  }
  
  return dates
}


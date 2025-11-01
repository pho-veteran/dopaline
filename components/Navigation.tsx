"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, User } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"

export function Navigation() {
  const pathname = usePathname()

  const items = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/",
    },
    {
      title: "Calendar",
      icon: <Calendar className="h-5 w-5" />,
      href: "/calendar",
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
    },
  ]

  // Wrap items with Link component for Next.js navigation
  const itemsWithLinks = items.map((item) => ({
    ...item,
    href: item.href,
  }))

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock
        items={itemsWithLinks}
        desktopClassName="glass-nav shadow-2xl"
        mobileClassName="glass-nav shadow-2xl"
      />
    </div>
  )
}
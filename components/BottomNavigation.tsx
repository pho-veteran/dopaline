"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const isHome = pathname === "/"
  const isProfile = pathname === "/profile"

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pixel-border-t border-t-4 border-white/30 bg-black/90 backdrop-blur-md safe-area-pb">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          <Link href="/" className="flex-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full h-full flex flex-col items-center justify-center gap-1 rounded-none",
                "hover:bg-white/10 transition-all font-pixel",
                isHome && "bg-white/10 text-white"
              )}
            >
              <Home className={cn("h-5 w-5", isHome && "text-blue-400")} />
              <span className={cn("text-xs", isHome && "font-semibold text-blue-400 font-pixel")}>
                Home
              </span>
            </Button>
          </Link>
          <Link href="/profile" className="flex-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full h-full flex flex-col items-center justify-center gap-1 rounded-none",
                "hover:bg-white/10 transition-all font-pixel",
                isProfile && "bg-white/10 text-white"
              )}
            >
              <User className={cn("h-5 w-5", isProfile && "text-blue-400")} />
              <span className={cn("text-xs", isProfile && "font-semibold text-blue-400 font-pixel")}>
                You
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}


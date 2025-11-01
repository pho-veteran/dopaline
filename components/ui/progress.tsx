import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative h-3 w-full overflow-hidden rounded-full backdrop-blur-sm bg-white/20 border border-white/30", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all shadow-lg shadow-blue-500/50"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }


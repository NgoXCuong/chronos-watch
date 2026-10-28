import * as React from "react"
import { cn } from "@/lib/utils"

// Textarea dùng chung cho form admin — cùng ngôn ngữ nhìn với ui/input.jsx
// (viền --input, nền card, focus là quầng navy thay vì ring đậm)
function Textarea({ className, error, ...props }) {
  return (
    <textarea
      aria-invalid={error ? true : undefined}
      className={cn(
        "flex w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm font-medium",
        "text-foreground placeholder:text-muted-foreground",
        "hover:border-navy-300 transition-colors",
        "focus-visible:outline-none focus-visible:border-navy-600 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error &&
          "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

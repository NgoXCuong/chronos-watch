import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  icon: Icon,
  error,
  ...props
}) {
  return (
    <div className="relative w-full group">
      {Icon && (
        <div className={cn(
          "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors",
          "group-focus-within:text-primary"
        )}>
          <Icon size={16} strokeWidth={2} />
        </div>
      )}
      <InputPrimitive
        type={type}
        aria-invalid={error ? true : undefined}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-card px-3 text-sm font-medium",
          "text-foreground ring-offset-background transition-colors",
          "placeholder:text-muted-foreground",
          "hover:border-navy-300",
          "focus-visible:outline-none focus-visible:border-navy-600 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-10",
          error && "border-destructive focus-visible:border-destructive focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }

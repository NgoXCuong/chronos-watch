import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  icon: Icon,
  error,
  variant = "dark",
  ...props
}) {
  const isLight = variant === "light" || 
    (className && (
      className.includes("bg-slate") || 
      className.includes("bg-white") ||
      className.includes("bg-gray")
    ));

  return (
    <div className="relative w-full group">
      {Icon && (
        <div className={cn(
          "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-500",
          isLight ? "text-zinc-400 group-focus-within:text-primary" : "text-zinc-500 group-focus-within:text-primary"
        )}>
          <Icon size={16} strokeWidth={1} />
        </div>
      )}
      <InputPrimitive
        type={type}
        className={cn(
          isLight
            ? "flex w-full rounded-none border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs ring-offset-background transition-all duration-700 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:border-primary focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 font-medium"
            : "flex h-14 w-full rounded-none border border-white/5 bg-zinc-900/50 px-4 py-4 text-xs ring-offset-background transition-all duration-700 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-100 font-light",
          Icon && "pl-12",
          error && (isLight ? "border-red-300 bg-red-50" : "border-red-500/30 bg-red-950/20"),
          className
        )}
        {...props}
      />
      <div className={cn(
        "absolute bottom-0 left-0 h-px bg-primary transition-all duration-1000 ease-out",
        "group-focus-within:w-full w-0"
      )}></div>
    </div>
  );
}

export { Input }

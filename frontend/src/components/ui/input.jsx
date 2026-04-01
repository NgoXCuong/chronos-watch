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
          "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300",
          isLight ? "text-slate-400 group-focus-within:text-amber-500" : "text-zinc-400 group-focus-within:text-white"
        )}>
          <Icon size={16} strokeWidth={1.5} />
        </div>
      )}
      <InputPrimitive
        type={type}
        className={cn(
          isLight
            ? "flex w-full rounded-none border border-zinc-300 bg-zinc-50/50 px-4 py-2 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900"
            : "flex h-12 w-full rounded-none border border-white/10 bg-zinc-900 px-4 py-3 text-sm ring-offset-background transition-all duration-500 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-amber-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-100 font-light",
          Icon && "pl-11",
          error && (isLight ? "border-red-400 bg-red-50" : "border-red-500/50 bg-red-950/20"),
          className
        )}
        {...props}
      />
      {!isLight && (
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500/50 group-focus-within:w-full transition-all duration-700"></div>
      )}
    </div>
  );
}

export { Input }

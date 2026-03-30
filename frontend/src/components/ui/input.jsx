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
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-white transition-colors duration-300">
          <Icon size={16} strokeWidth={1.5} />
        </div>
      )}
      <InputPrimitive
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border border-white/10 bg-zinc-900 px-4 py-3 text-sm ring-offset-background transition-all duration-500 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-amber-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-100 font-light",
          Icon && "pl-11",
          error && "border-red-500/50 bg-red-950/20",
          className
        )}
        {...props}
      />
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500/50 group-focus-within:w-full transition-all duration-700"></div>
    </div>
  );
}

export { Input }

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none text-sm font-medium tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20",
        primary: "bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20",
        luxury: "bg-zinc-100 text-zinc-950 hover:bg-white shadow-xl shadow-white/5",
        outline: "border border-amber-500/30 bg-transparent text-amber-500 hover:bg-amber-500/5",
        secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
        ghost: "hover:bg-zinc-800 hover:text-zinc-100",
        link: "text-amber-500 underline-offset-4 hover:underline",
        destructive: "bg-red-900/20 border border-red-500/30 text-red-500 hover:bg-red-500/10",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
        full: "w-full h-12 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  loading = false,
  children,
  ...props
}) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants }

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none text-[10px] font-bold uppercase transition-all duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_30px_rgba(197,160,89,0.2)] border-none",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_30px_rgba(197,160,89,0.2)] border-none",
        luxury: "bg-white text-zinc-950 hover:bg-zinc-100 shadow-xl shadow-white/5 border border-zinc-200",
        outline: "border border-primary/30 bg-transparent text-primary hover:bg-primary/5 hover:border-primary transition-colors",
        secondary: "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-white/5",
        ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline font-bold",
        destructive: "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20",
      },
      size: {
        default: "h-14 px-10",
        sm: "h-10 px-6",
        lg: "h-16 px-12",
        icon: "h-12 w-12",
        full: "w-full h-14 px-10",
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

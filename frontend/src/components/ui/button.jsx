import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

// "Shine sweep" — vệt kính trượt trên nút đặc màu; bản tint navy cho nút outline (variant buy)
const SHINE = "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,.28)_50%,transparent_60%)] before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-full motion-reduce:before:hidden"
const SHINE_NAVY = "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_40%,rgba(30,58,95,.16)_50%,transparent_60%)] before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-full motion-reduce:before:hidden"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg text-sm font-semibold uppercase transition-all duration-200 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,.18)] disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-px hover:shadow-hover active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0 group",
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground shadow-card hover:bg-primary/90 ${SHINE}`,
        primary: `bg-primary text-primary-foreground shadow-card hover:bg-primary/90 ${SHINE}`,
        buy: `border border-navy-600 bg-card text-navy-700 hover:bg-navy-600 hover:text-white ${SHINE_NAVY}`,
        outline: "border border-input bg-card text-foreground shadow-card hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        link: "text-navy-600 underline-offset-4 hover:underline hover:translate-y-0 hover:shadow-none",
        destructive: `bg-destructive text-destructive-foreground shadow-card hover:bg-destructive/90 ${SHINE}`,
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        full: "w-full h-12 px-6",
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

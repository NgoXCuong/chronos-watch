import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        brand: "border-transparent bg-navy-100 text-navy-700 uppercase tracking-[0.02em]",
        sale: "border-transparent bg-sale-soft text-sale",
        success: "border-transparent bg-success-soft text-success",
        warning: "border-transparent bg-warning-soft text-warning",
        info: "border-transparent bg-info-soft text-info",
        teal: "border-transparent bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200",
        violet: "border-transparent bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-sale-soft text-sale",
        "destructive-soft": "border-sale-soft/80 bg-sale-soft/60 text-sale dark:border-sale/30 dark:bg-sale/15 dark:text-sale-soft",
        muted: "border-border bg-muted text-muted-foreground",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  // <span> chứ không phải <div>: Badge hay nằm trong <p>/<h*> (cell tên, dòng
  // bảng) — div trong <p> là HTML sai, React 19 báo hydration error.
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

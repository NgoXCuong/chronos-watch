import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

// Overlay z-150: header admin sticky ở z-100 nên modal phải nằm trên,
// còn dropdown (cũng z-150) được portal sau nên vẫn hiện đè lên modal.
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-900/45 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-150 w-full animate-in fade-in zoom-in duration-200">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ className, children, ...props }) => (
  <div
    className={cn(
      "mx-auto max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl",
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col gap-1 border-b border-border bg-navy-50/60 px-5 py-4 text-left dark:bg-navy-500/10",
      className
    )}
    {...props}
  />
)

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4",
      className
    )}
    {...props}
  />
)

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[15px] font-extrabold tracking-tight text-navy-700 dark:text-navy-100",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogCloseButton = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Đóng"
    className={cn(
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors",
      "hover:border-sale hover:bg-sale-soft hover:text-sale focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)] focus-visible:outline-none",
      className
    )}
  >
    <X className="h-4 w-4" strokeWidth={2} />
  </button>
)

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogCloseButton,
}

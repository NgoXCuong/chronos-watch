import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

export const Sheet = (props) => <DialogPrimitive.Root {...props} />;

export const SheetContent = ({ className, children, ...props }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Backdrop className="fixed inset-0 z-150 bg-navy-950/45 backdrop-blur-sm transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
    <DialogPrimitive.Popup
      className={cn("fixed inset-y-0 right-0 z-150 flex w-full max-w-xl flex-col border-l border-border bg-card text-card-foreground shadow-2xl transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Popup>
  </DialogPrimitive.Portal>
);

export const SheetTitle = ({ className, ...props }) => (
  <DialogPrimitive.Title className={cn("text-lg font-bold text-foreground", className)} {...props} />
);
export const SheetDescription = ({ className, ...props }) => (
  <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />
);
export const SheetClose = (props) => (
  <DialogPrimitive.Close className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="Đóng chi tiết" {...props}>
    <X size={18} aria-hidden="true" />
  </DialogPrimitive.Close>
);

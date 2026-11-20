import { AlertDialog as AlertPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";

export const AlertDialog = (props) => <AlertPrimitive.Root {...props} />;
export const AlertDialogContent = ({ className, children, ...props }) => (
  <AlertPrimitive.Portal>
    <AlertPrimitive.Backdrop className="fixed inset-0 z-200 bg-navy-950/45 backdrop-blur-sm" />
    <AlertPrimitive.Popup className={cn("fixed left-1/2 top-1/2 z-200 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-2xl", className)} {...props}>
      {children}
    </AlertPrimitive.Popup>
  </AlertPrimitive.Portal>
);
export const AlertDialogTitle = ({ className, ...props }) => (
  <AlertPrimitive.Title className={cn("text-lg font-bold", className)} {...props} />
);
export const AlertDialogDescription = ({ className, ...props }) => (
  <AlertPrimitive.Description className={cn("mt-2 text-sm leading-relaxed text-muted-foreground", className)} {...props} />
);

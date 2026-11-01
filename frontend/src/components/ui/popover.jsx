import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

function Popover(props) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger(props) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({ className, align = "start", side = "bottom", sideOffset = 6, ...props }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner align={align} side={side} sideOffset={sideOffset} className="z-150 outline-none">
        <PopoverPrimitive.Popup
          className={cn(
            "max-h-(--available-height) w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-hover outline-none",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverTitle({ className, ...props }) {
  return <PopoverPrimitive.Title className={cn("text-xs font-semibold", className)} {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverTitle };

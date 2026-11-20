import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./button-variants";

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

export { Button }

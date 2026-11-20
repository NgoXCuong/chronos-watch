import * as React from "react"
import { cn } from "../../lib/utils"

import { badgeVariants } from "./badge-variants";

function Badge({ className, variant, ...props }) {
  // <span> chứ không phải <div>: Badge hay nằm trong <p>/<h*> (cell tên, dòng
  // bảng) — div trong <p> là HTML sai, React 19 báo hydration error.
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }

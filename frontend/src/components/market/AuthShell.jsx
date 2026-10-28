import React from "react";
import { Watch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AuthBrand } from "./AuthBrand";
import AuthShowcase from "./AuthShowcase";

/**
 * Khung trang auth: panel ảnh (showcase props) + Card form rộng trên nền navy-50 có họa tiết Watch chìm.
 * children = form; footer = vùng link chéo dưới form.
 */
export default function AuthShell({
  showcase,
  reverse = false,
  formClassName,
  children,
  footer,
}) {
  return (
    <div className="flex min-h-dvh flex-col overflow-hidden bg-navy-50 italic-fade-in md:flex-row">
      <AuthShowcase {...showcase} reverse={reverse} />

      <main className="relative order-1 flex w-full flex-col items-center justify-center overflow-y-auto scrollbar-hide p-6 md:order-2 md:w-[52%] md:p-10">
        <Watch
          size={420}
          strokeWidth={1}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 text-navy-600 opacity-5"
        />
        <AuthBrand className="mb-8 md:hidden" />

        <Card
          className={cn(
            "relative z-10 w-full max-w-xl border-navy-200/70 bg-card/85 shadow-hover backdrop-blur-sm",
            formClassName,
          )}
        >
          <CardContent className="px-6 py-8 sm:px-10">
            {children}
            {footer && (
              <div className="mt-8 border-t border-border pt-5 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

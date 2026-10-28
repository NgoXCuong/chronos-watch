import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { REVIEW_STARS } from "../../../constants/reviewFilter";

// Sao vẫn giữ amber theo ngoại lệ của design system (rule: không vàng, trừ rating)
export const ReviewStars = ({ rating = 0, size = 12, className }) => (
  <span
    className={cn("flex items-center gap-0.5", className)}
    aria-label={`${rating} trên 5 sao`}
  >
    {REVIEW_STARS.map((star) => (
      <Star
        key={star}
        size={size}
        strokeWidth={2}
        className={
          star <= rating
            ? "fill-amber-500 text-amber-500"
            : "text-border dark:text-navy-500/40"
        }
      />
    ))}
  </span>
);

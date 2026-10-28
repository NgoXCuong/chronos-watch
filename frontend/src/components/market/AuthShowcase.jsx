import React from "react";
import { cn } from "@/lib/utils";
import { AuthBrand, AuthEyebrow } from "./AuthBrand";

/** Panel cảm hứng của trang auth: ảnh + overlay navy + lời mời mua. */
export default function AuthShowcase({
  image,
  imageAlt,
  eyebrow,
  eyebrowIcon,
  title,
  quote,
  marks = [],
  reverse = false,
}) {
  return (
    <div
      className={cn(
        "relative hidden w-[48%] overflow-hidden bg-navy-900 md:block",
        reverse ? "md:order-2" : "md:order-1",
      )}
    >
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-tr from-navy-950/10 via-navy-900/50 to-navy-800/40" />

      <div className="relative z-10 flex h-full flex-col justify-between p-12">
        <AuthBrand className="[&_span:last-child]:text-white" />

        <div className="max-w-lg">
          <AuthEyebrow icon={eyebrowIcon}>{eyebrow}</AuthEyebrow>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white lg:text-[44px]">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy-100">
            {quote}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {marks.map((mark) => (
            <li
              key={mark}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-navy-100"
            >
              <span
                className="size-1 rounded-full bg-navy-300"
                aria-hidden="true"
              />
              {mark}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

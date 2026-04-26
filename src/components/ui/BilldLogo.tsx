"use client";

import Link from "next/link";

interface BilldLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
}

const sizes = {
  sm: {
    width: 90,
    height: 30,
    rx: 8,
    fontSize: 13,
    lineW: [14, 11, 8],
    lineH: 2,
    lineX: 10,
    lineY: [9, 14, 19],
    divX: 32,
    textX: 40,
    textY: 19,
  },
  md: {
    width: 108,
    height: 36,
    rx: 10,
    fontSize: 16,
    lineW: [16, 12, 9],
    lineH: 2.5,
    lineX: 12,
    lineY: [11, 17, 23],
    divX: 38,
    textX: 47,
    textY: 23,
  },
  lg: {
    width: 136,
    height: 46,
    rx: 12,
    fontSize: 20,
    lineW: [20, 15, 11],
    lineH: 3,
    lineX: 14,
    lineY: [14, 21, 29],
    divX: 48,
    textX: 58,
    textY: 29,
  },
};

export function BilldLogo({
  href,
  size = "md",
  theme = "light",
  className = "",
}: BilldLogoProps) {
  const s = sizes[size];

  const logo = (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${s.width} ${s.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Billd"
      className={className}
    >
      {/* Badge background */}
      <rect width={s.width} height={s.height} rx={s.rx} fill="" />

      {/* Receipt mark — 3 lines representing invoice line items */}
      <rect
        x={s.lineX}
        y={s.lineY[0]}
        width={s.lineW[0]}
        height={s.lineH}
        rx={s.lineH / 2}
        fill="white"
        opacity="0.95"
      />
      <rect
        x={s.lineX}
        y={s.lineY[1]}
        width={s.lineW[1]}
        height={s.lineH}
        rx={s.lineH / 2}
        fill="white"
        opacity="0.95"
      />
      <rect
        x={s.lineX}
        y={s.lineY[2]}
        width={s.lineW[2]}
        height={s.lineH}
        rx={s.lineH / 2}
        fill="white"
        opacity="0.95"
      />

      {/* Subtle divider between mark and text */}
      <rect
        x={s.divX}
        y={s.height * 0.25}
        width={1}
        height={s.height * 0.5}
        fill="white"
        opacity="0.25"
      />

      {/* Wordmark */}
      <text
        x={s.textX}
        y={s.textY}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize={s.fontSize}
        fontWeight="700"
        fill="white"
        letterSpacing="-0.3"
      >
        billd
      </text>
    </svg>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logo}
      </Link>
    );
  }

  return logo;
}

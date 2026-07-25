'use client'

import React from 'react'

interface AppLogoSvgProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Modern Dynamic Vector SVG Logo
 * Uses CSS `fill-primary`, `fill-foreground`, `stroke-primary` so the colors
 * automatically change whenever you update your website's CSS variables (--primary, etc.)
 */
export function AppLogoSvg({
  width = 160,
  height = 48,
  className = '',
  ...props
}: AppLogoSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 60"
      width={width}
      height={height}
      className={`select-none ${className}`}
      {...props}
    >
      {/* Icon Graphic Group */}
      <g transform="translate(10, 0)">
        {/* Hexagon / Shield outer ring */}
        <path
          d="M 25 2 L 43 12 L 43 38 L 25 48 L 7 38 L 7 12 Z"
          fill="none"
          className="stroke-primary"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Tech Brackets < /> */}
        <path
          d="M 17 20 L 12 25 L 17 30"
          fill="none"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 33 20 L 38 25 L 33 30"
          fill="none"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="27"
          y1="18"
          x2="23"
          y2="32"
          className="stroke-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Brand Text Group */}
      {/* "IT" - Bold Primary Color */}
      <text
        x="68"
        y="39"
        fontFamily="inherit"
        fontSize="35"
        fontWeight="800"
        letterSpacing="0.5"
        className="fill-primary"
      >
        IT
      </text>

      {/* "-" Separator */}
      <text
        x="104"
        y="37"
        fontFamily="inherit"
        fontSize="35"
        fontWeight="400"
        className="fill-muted-foreground opacity-60"
      >
        -
      </text>

      {/* "JOB" - Dynamic Text Color (Adapts to light/dark foreground) */}
      <text
        x="120"
        y="39"
        fontFamily="inherit"
        fontSize="35"
        fontWeight="700"
        letterSpacing="0.5"
        className="fill-foreground"
      >
        JOB
      </text>

      {/* Small dot accent */}
      <circle cx="198" cy="36" r="3.5" className="fill-primary" />
    </svg>
  )
}

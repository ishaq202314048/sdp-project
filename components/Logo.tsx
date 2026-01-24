"use client";

import Image from "next/image";
import React from "react";

interface LogoProps {
  size?: number; // pixel size for width/height
  className?: string;
}

// Displays the Troop Track logo inside a round avatar
export default function Logo({ size = 32, className }: LogoProps) {
  const dimension = size;
  return (
    <div
      className={`rounded-full overflow-hidden border border-muted w-[${dimension}px] h-[${dimension}px] bg-background ${className ?? ""}`}
      style={{ width: dimension, height: dimension }}
      aria-label="Troop Track logo"
      title="Troop Track"
    >
      {/* Expect the logo image to be placed at /public/logo.png */}
      <Image
        src="/logo.png"
        alt="Troop Track Logo"
        width={dimension}
        height={dimension}
        priority
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

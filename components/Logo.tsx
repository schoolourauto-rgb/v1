"use client"

import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 140, height = 40, className = "" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="OurAuto Logo"
      width={width}
      height={height}
      className={className}
      style={{ display: "block", maxWidth: "100%", height: "auto" }}
      draggable={false}
    />
  );
}

export default Logo;
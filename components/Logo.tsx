"use client"

import Image from "next/image";
import { useTheme } from "next-themes";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? "/logo-light.png" : "/logo-dark.png";
  return (
    <Image
      src={logoSrc}
      alt="OurAuto Logo"
      width={140}
      height={40}
      style={{ height: "auto", width: 140 }}
      priority
    />
  );
}
"use client"
import { ThemeProvider } from 'next-themes'
import React from 'react'

export default function ThemeProviderClient({
  children,
  attribute = 'class',
  defaultTheme = 'dark',
}: {
  children: React.ReactNode
  attribute?: any
  defaultTheme?: string
}) {
  const Theme = ThemeProvider as unknown as any
  return <Theme attribute={attribute} defaultTheme={defaultTheme}>{children}</Theme>
}

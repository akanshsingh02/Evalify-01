"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    if (stored === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }

  if (!mounted) return null
  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle dark mode">
      <span className="sr-only">Toggle dark mode</span>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-foreground">
        <path
          fill="currentColor"
          d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16a5 5 0 1 0 0-10a5 5 0 0 0 0 10Zm9-5a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.657 6.657a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414ZM8.464 7.05a1 1 0 0 1-1.415-1.414l.708-.707a1 1 0 1 1 1.414 1.414l-.707.707Zm9.193-1.414l-.707.707A1 1 0 0 1 15.536 4.93l.707-.707a1 1 0 0 1 1.414 1.414ZM7.05 15.536a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0Z"
        />
      </svg>
    </Button>
  )
}

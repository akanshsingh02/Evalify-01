"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const isDashboard =
    pathname?.startsWith("/student") || pathname?.startsWith("/teacher") || pathname?.startsWith("/admin")

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="Evalify Home">
          <div className="h-6 w-6 rounded-md bg-primary" aria-hidden="true" />
          <span className="font-semibold">Evalify</span>
        </Link>

        {!isDashboard && (
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#why" className="text-sm text-muted-foreground hover:text-foreground">
              Why Us
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isDashboard && (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

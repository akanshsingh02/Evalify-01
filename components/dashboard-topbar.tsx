"use client"

import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function DashboardTopbar() {
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-primary" aria-hidden="true" />
        <span className="font-semibold">Evalify</span>
      </div>
      <div className="flex max-w-md flex-1 items-center gap-2 pl-4">
        <div className="w-full">
          <label htmlFor="global-search" className="sr-only">
            Global Search
          </label>
          <Input id="global-search" ref={searchRef} placeholder="Search (press /)" />
        </div>
        <Button variant="ghost" aria-label="Notifications">
          <span className="sr-only">Open notifications</span>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-foreground">
            <path
              fill="currentColor"
              d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
            />
          </svg>
        </Button>
        <Button variant="outline">Profile</Button>
        <Button
          variant="destructive"
          onClick={async () => {
            await signOut({ redirect: false })
            router.replace("/login")
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

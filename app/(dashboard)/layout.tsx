import type { ReactNode } from "react"
import { auth } from "@/auth"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  // session is required for dashboard routes; middleware also enforces this
  return <>{children}</>
}

import type { ReactNode } from "react"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Detect role by pathname segment
  // student/* | teacher/* | admin/*
  let role: "student" | "teacher" | "admin" = "student"
  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path.startsWith("/teacher")) role = "teacher"
    if (path.startsWith("/admin")) role = "admin"
  }

  return (
    <div className="min-h-screen">
      <DashboardTopbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role={role} />
        <main className="flex-1 p-4 animate-fade-in-up">{children}</main>
      </div>
    </div>
  )
}

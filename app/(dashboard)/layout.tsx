import type { ReactNode } from "react"
import { auth } from "@/auth"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const role = ((session?.user as any)?.role || "student") as "student" | "teacher" | "admin"
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

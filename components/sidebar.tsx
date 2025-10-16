"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Role = "student" | "teacher" | "admin"
const navByRole: Record<Role, { label: string; href: string }[]> = {
  student: [
    { label: "Overview", href: "/student" },
    { label: "My Submissions", href: "/student/submissions" },
    { label: "Analytics", href: "/student/analytics" },
  ],
  teacher: [
    { label: "Overview", href: "/teacher" },
    { label: "Submissions", href: "/teacher/submissions" },
    { label: "Tests", href: "/teacher/tests" },
  ],
  admin: [
    { label: "Overview", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Exams", href: "/admin/exams" },
  ],
}

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const items = navByRole[role] ?? []

  return (
    <aside className="hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-sidebar md:block">
      <div className="p-4">
        <div className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Navigation</div>
        <nav className="flex flex-col gap-1" aria-label={`${role} navigation`}>
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

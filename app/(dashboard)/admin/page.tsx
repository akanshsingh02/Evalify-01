import { auth } from "@/auth"
import { AdminUsersPanel } from "@/components/admin-users-panel"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return null
  }
  return (
    <div className="grid gap-4">
      <AdminUsersPanel />
    </div>
  )
}

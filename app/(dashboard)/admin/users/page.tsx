import { auth } from "@/auth"
import { AdminPanel } from "@/components/admin-panel"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return null
  }
  return <AdminPanel />
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { AdminPanel } from "@/components/admin-panel"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return null
  }
  return (
    <div className="grid gap-4">
      <AdminPanel />
    </div>
  )
}

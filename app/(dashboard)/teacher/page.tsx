import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { TeacherManager } from "@/components/teacher-manager"

export default async function TeacherDashboard() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["teacher", "admin"].includes(role)) {
    return null
  }
  return (
    <div className="grid gap-4">
      <TeacherManager />
      <Card>
        <CardHeader>
          <CardTitle>Submissions Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Manage test submissions and apply overrides.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Class Analytics</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Coming soon.
        </CardContent>
      </Card>
    </div>
  )
}

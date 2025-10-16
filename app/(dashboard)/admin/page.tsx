import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add, edit, delete users with role assignment (placeholder).
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manage Exams</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Schedule, activate, close exams (placeholder).
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Branding, integrations, notifications (placeholder).
        </CardContent>
      </Card>
    </div>
  )
}

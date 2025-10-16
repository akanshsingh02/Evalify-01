import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeacherDashboard() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Create & Schedule Tests</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder UI for test creation (MCQ, short, descriptive).
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Submissions Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          AI preliminary grading preview and manual override (placeholder).
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Class Analytics</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Avg score, topic difficulty, top/low performer (placeholder).
        </CardContent>
      </Card>
    </div>
  )
}

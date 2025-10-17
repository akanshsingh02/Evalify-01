import { auth } from "@/auth"
import { TeacherAnalyticsCharts } from "@/components/teacher-analytics-charts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function TeacherTestAnalytics({ params }: { params: Promise<{ id?: string }> }) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["teacher", "admin"].includes(role)) return null
  const { id } = await params
  if (!id) return null
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/tests/${id}/analytics`, { cache: "no-store" })
  const data = await res.json().catch(() => ({} as any))
  const summary = data?.summary
  const topics = data?.topics || []
  return (
    <div className="p-4 grid gap-3">
      <div className="text-xl font-semibold">Test Analytics</div>
      {summary ? (
        <div className="rounded border p-3 text-sm">
          <div>Submissions: {summary.count}</div>
          <div>Average Score: {Math.round(summary.avg * 10) / 10}</div>
          <div>Highest Score: {summary.max}</div>
          <div>Lowest Score: {summary.min}</div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No data</div>
      )}
      <TeacherAnalyticsCharts summary={summary || {}} topics={topics} />
    </div>
  )
}

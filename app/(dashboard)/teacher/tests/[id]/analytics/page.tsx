import { auth } from "@/auth"

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
      <div className="grid gap-2">
        <div className="text-sm font-medium">Topic-wise performance</div>
        {topics.length === 0 && <div className="text-sm text-muted-foreground">No topic data</div>}
        {topics.map((t: any) => (
          <div key={t.topic} className="rounded border p-2 text-sm flex items-center justify-between">
            <div>{t.topic}</div>
            <div className="text-xs text-muted-foreground">Avg: {t.avgPercent}% · Correct rate: {t.correctRate || 0}% · Questions: {t.totalQuestions || 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

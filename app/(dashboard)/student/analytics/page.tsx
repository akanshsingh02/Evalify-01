import { auth } from "@/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function StudentAnalyticsPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["student", "admin"].includes(role)) return null
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/student/analytics`, { cache: "no-store" })
  const data = await res.json().catch(() => ({} as any))
  const history = Array.isArray(data?.history) ? data.history : []
  const topics = Array.isArray(data?.topics) ? data.topics : []
  return (
    <div className="p-4 grid gap-4">
      <div className="text-xl font-semibold">My Analytics</div>
      <div className="grid gap-2">
        <div className="text-sm font-medium">Performance History</div>
        {history.length === 0 && <div className="text-sm text-muted-foreground">No history yet</div>}
        {history.map((h: any) => (
          <div key={h.id} className="rounded border p-2 text-sm flex items-center justify-between">
            <div>Test: {h.testId}</div>
            <div className="text-xs text-muted-foreground">Score: {h.score}/{h.maxScore} · {h.percent}%</div>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <div className="text-sm font-medium">Topic Strengths</div>
        {topics.length === 0 && <div className="text-sm text-muted-foreground">No topic data yet</div>}
        {topics.map((t: any) => (
          <div key={t.topic} className="rounded border p-2 text-sm flex items-center justify-between">
            <div>{t.topic}</div>
            <div className="text-xs text-muted-foreground">Avg: {t.avgPercent}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

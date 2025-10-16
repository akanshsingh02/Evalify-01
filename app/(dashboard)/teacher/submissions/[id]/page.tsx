import { auth } from "@/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function TeacherSubmissionDetail({ params }: { params: Promise<{ id?: string }> }) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["teacher", "admin"].includes(role)) return null
  const { id } = await params
  if (!id) return null
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/submissions/${id}`, { cache: "no-store" })
  const data = await res.json().catch(() => ({} as any))
  const s = data?.submission
  const test = data?.test
  if (!s) return <div className="p-4 text-sm text-muted-foreground">Submission not found</div>
  return (
    <div className="p-4 grid gap-3">
      <div className="text-xl font-semibold">Submission Detail</div>
      <div className="text-sm">Submission ID: {String(s._id || id)}</div>
      <div className="text-sm">Student: {s.studentId}</div>
      {test && <div className="text-sm">Test: {test.title}</div>}
      <div className="text-sm">
        Score: <span className="font-medium">{typeof s.overriddenScore === "number" ? s.overriddenScore : s.score ?? "-"}</span>
        {typeof s.totalScore === "number" && typeof s.maxScore === "number" && (
          <span className="ml-2 text-xs text-muted-foreground">({s.totalScore}/{s.maxScore})</span>
        )}
        {typeof s.overriddenScore === "number" && <span className="ml-2 text-xs uppercase text-muted-foreground">overridden</span>}
      </div>
      {Array.isArray(s.attachments) && s.attachments.length > 0 && (
        <div className="mt-2 text-sm">
          <div className="font-medium">Attachments</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {s.attachments.map((url: string, idx: number) => (
              <a key={url + idx} href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">File {idx + 1}</a>
            ))}
          </div>
        </div>
      )}
      {Array.isArray(s.results) && s.results.length > 0 && (
        <div className="mt-2 text-sm">
          <div className="font-medium">Per-question results</div>
          <div className="mt-1 grid gap-2">
            {s.results.map((r: any, idx: number) => (
              <div key={idx} className="rounded border p-2">
                <div className="flex items-start justify-between">
                  <div className="font-medium">Q{idx + 1}</div>
                  <div className="text-xs">
                    {typeof r.correct === "boolean" && (r.correct ? "Correct" : "Incorrect")}
                    {typeof r.similarity === "number" && ` · sim: ${r.similarity}`}
                    {` · ${r.score}/${r.maxPoints}`}
                  </div>
                </div>
                {Array.isArray(test?.items) && test.items[idx] && (
                  <div className="mt-1 text-xs text-muted-foreground">{test.items[idx].prompt}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

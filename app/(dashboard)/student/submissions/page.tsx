import { auth } from "@/auth"

export default async function StudentSubmissionsPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["student", "admin"].includes(role)) {
    return null
  }
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/submissions`, { cache: "no-store" })
  const data = await res.json().catch(() => ({ submissions: [] }))
  const submissions = Array.isArray(data.submissions) ? data.submissions : []
  return (
    <div className="grid gap-3">
      <h2 className="text-lg font-semibold">My Submissions</h2>
      {submissions.length === 0 && <div className="text-sm text-muted-foreground">No submissions yet.</div>}
      {submissions.map((s: any) => (
        <div key={s._id} className="rounded-md border p-3">
          <div className="font-medium">{s.testTitle || s.testId}</div>
          <div className="text-sm text-muted-foreground">Submitted at {new Date(s.createdAt).toLocaleString()}</div>
          <div className="mt-1 text-sm">Score: {s.score ?? "-"} {s.overridden ? <span className="text-xs uppercase text-muted-foreground">(overridden)</span> : null}</div>
        </div>
      ))}
    </div>
  )
}

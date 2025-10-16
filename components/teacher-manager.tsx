"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

function safeParseItems(json: string): any[] {
  if (!json || !json.trim()) return []
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function TeacherManager() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState("")
  const [tests, setTests] = useState<any[]>([])
  const [selectedTestId, setSelectedTestId] = useState<string>("")
  const [submissions, setSubmissions] = useState<any[]>([])
  const [startAt, setStartAt] = useState<string>("")
  const [endAt, setEndAt] = useState<string>("")
  const [itemsJson, setItemsJson] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function loadTests() {
    const res = await fetch("/api/tests")
    const data = await res.json().catch(() => ({ tests: [] }))
    setTests(Array.isArray(data.tests) ? data.tests : [])
  }

  useEffect(() => {
    loadTests()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!selectedTestId) return setSubmissions([])
      const res = await fetch(`/api/tests/${selectedTestId}/submissions`)
      const data = await res.json().catch(() => ({ submissions: [] }))
      setSubmissions(Array.isArray(data.submissions) ? data.submissions : [])
    })()
  }, [selectedTestId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create & Manage Tests</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Textarea placeholder="One question per line" value={questions} onChange={(e) => setQuestions(e.target.value)} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <input
            type="datetime-local"
            className="h-9 rounded-md border px-2 text-sm"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            placeholder="Start time"
          />
          <input
            type="datetime-local"
            className="h-9 rounded-md border px-2 text-sm"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            placeholder="End time"
          />
        </div>
        <Textarea placeholder='Items JSON (e.g., [{"id":"q1","type":"mcq","prompt":"2+2?","options":["3","4"],"answer":"4","maxPoints":2}])' value={itemsJson} onChange={(e) => setItemsJson(e.target.value)} />
        <div className="flex gap-2">
          <Button
            disabled={loading || !title}
            onClick={async () => {
              setLoading(true)
              await fetch("/api/tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, questions, status: "draft", startAt, endAt, items: safeParseItems(itemsJson) }),
              })
              setTitle("")
              setDescription("")
              setQuestions("")
              setStartAt("")
              setEndAt("")
              await loadTests()
              setLoading(false)
            }}
          >
            Save Draft
          </Button>
          <Button
            variant="outline"
            disabled={loading || !title}
            onClick={async () => {
              setLoading(true)
              await fetch("/api/tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, questions, status: "published", startAt, endAt, items: safeParseItems(itemsJson) }),
              })
              setTitle("")
              setDescription("")
              setQuestions("")
              setStartAt("")
              setEndAt("")
              await loadTests()
              setLoading(false)
            }}
          >
            Publish
          </Button>
        </div>
        <div className="grid gap-2">
          {tests.map((t) => (
            <div key={t._id} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.title}</div>
                <div className="text-xs uppercase text-muted-foreground">{t.status}</div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{t.description}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t.startAt ? `Starts: ${new Date(t.startAt).toLocaleString()}` : "No start"} · {t.endAt ? `Ends: ${new Date(t.endAt).toLocaleString()}` : "No end"}
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await fetch(`/api/tests/${t._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: t.status === "published" ? "draft" : "published" }) })
                    await loadTests()
                  }}
                >
                  {t.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const ns = prompt("Enter new start date-time (YYYY-MM-DDTHH:mm) or leave blank to clear", t.startAt ? new Date(t.startAt).toISOString().slice(0, 16) : "")
                    const ne = prompt("Enter new end date-time (YYYY-MM-DDTHH:mm) or leave blank to clear", t.endAt ? new Date(t.endAt).toISOString().slice(0, 16) : "")
                    await fetch(`/api/tests/${t._id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ startAt: ns ? ns : null, endAt: ne ? ne : null }),
                    })
                    await loadTests()
                  }}
                >
                  Edit Schedule
                </Button>
                <Button size="sm" onClick={() => setSelectedTestId(String(t._id))}>
                  View Submissions
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const val = prompt("Paste Items JSON to replace", JSON.stringify(t.items || [], null, 2))
                    if (val == null) return
                    let parsed: any[] = []
                    try { parsed = JSON.parse(val) } catch {}
                    await fetch(`/api/tests/${t._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: parsed }) })
                    await loadTests()
                  }}
                >
                  Replace Items
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedTestId && (
          <div className="mt-4 grid gap-2">
            <div className="text-sm font-medium">Submissions for Test: {selectedTestId}</div>
            {submissions.length === 0 && <div className="text-sm text-muted-foreground">No submissions yet.</div>}
            {submissions.map((s) => (
              <div key={s._id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div>Student: {s.studentId}</div>
                    <div>
                      Score: <span className="font-medium">{typeof s.overriddenScore === "number" ? s.overriddenScore : s.score ?? "-"}</span>
                      {typeof s.overriddenScore === "number" && <span className="ml-2 text-xs uppercase text-muted-foreground">overridden</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="h-9 w-20 rounded-md border px-2 text-sm"
                      placeholder="Score"
                      onKeyDown={async (e) => {
                        if (e.key !== "Enter") return
                        const val = Number((e.target as HTMLInputElement).value)
                        if (Number.isNaN(val)) return
                        await fetch(`/api/submissions/${s._id}/override`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ score: val }),
                        })
                        ;(e.target as HTMLInputElement).value = ""
                        const res = await fetch(`/api/tests/${selectedTestId}/submissions`)
                        const data = await res.json().catch(() => ({ submissions: [] }))
                        setSubmissions(Array.isArray(data.submissions) ? data.submissions : [])
                      }}
                    />
                    <span className="text-xs text-muted-foreground">Press Enter to override</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

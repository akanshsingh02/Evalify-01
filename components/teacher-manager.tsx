"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type ItemType = "mcq" | "short" | "descriptive"
interface BuilderItem {
  id: string
  type: ItemType
  prompt: string
  options?: string[]
  answer?: string | string[]
  maxPoints: number
  topic?: string
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
  const [items, setItems] = useState<BuilderItem[]>([])
  const [newType, setNewType] = useState<ItemType>("mcq")
  const [newPrompt, setNewPrompt] = useState<string>("")
  const [newOptionsText, setNewOptionsText] = useState<string>("")
  const [newCorrectText, setNewCorrectText] = useState<string>("")
  const [newMaxPoints, setNewMaxPoints] = useState<number>(1)
  const [newTopic, setNewTopic] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrompt, setEditPrompt] = useState<string>("")
  const [editMaxPoints, setEditMaxPoints] = useState<number>(1)
  const [editOptionsText, setEditOptionsText] = useState<string>("")
  const [editAnswerText, setEditAnswerText] = useState<string>("")
  const [editTopic, setEditTopic] = useState<string>("")

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
        <div className="rounded-md border p-3">
          <div className="mb-2 text-sm font-medium">Add Item</div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-1">
              <label className="text-xs">Type</label>
              <select className="h-9 rounded-md border px-2 text-sm" value={newType} onChange={(e) => setNewType(e.target.value as ItemType)}>
                <option value="mcq">MCQ</option>
                <option value="short">Short</option>
                <option value="descriptive">Descriptive</option>
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-xs">Max Points</label>
              <input className="h-9 rounded-md border px-2 text-sm" type="number" min={1} value={newMaxPoints} onChange={(e) => setNewMaxPoints(Number(e.target.value) || 1)} />
            </div>
            <div className="grid gap-1">
              <label className="text-xs">Topic (optional)</label>
              <Input className="h-9" placeholder="e.g. Algebra" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
            </div>
          </div>
          <div className="mt-2 grid gap-2">
            <div className="grid gap-1">
              <label className="text-xs">Prompt</label>
              <Textarea placeholder="Enter the question prompt" value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} />
            </div>
            {newType === "mcq" && (
              <>
                <div className="grid gap-1">
                  <label className="text-xs">Options (one per line)</label>
                  <Textarea placeholder={"e.g.\n3\n4"} value={newOptionsText} onChange={(e) => setNewOptionsText(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <label className="text-xs">Correct answer(s) (comma-separated; must match options)</label>
                  <Input placeholder="e.g. 4 or 3,4" value={newCorrectText} onChange={(e) => setNewCorrectText(e.target.value)} />
                </div>
              </>
            )}
            {newType === "short" && (
              <div className="grid gap-1">
                <label className="text-xs">Exact answer</label>
                <Input placeholder="Reference answer" value={newCorrectText} onChange={(e) => setNewCorrectText(e.target.value)} />
              </div>
            )}
            {newType === "descriptive" && (
              <div className="grid gap-1">
                <label className="text-xs">Reference answer (used for similarity)</label>
                <Textarea placeholder="Reference answer for similarity" value={newCorrectText} onChange={(e) => setNewCorrectText(e.target.value)} />
              </div>
            )}
          </div>
          <div className="mt-2">
            <Button
              size="sm"
              onClick={() => {
                const prompt = newPrompt.trim()
                const pts = Number(newMaxPoints) || 1
                if (!prompt) return alert("Prompt is required")
                if (pts < 1) return alert("Max points must be at least 1")
                const base: BuilderItem = { id: `q${Date.now()}`, type: newType, prompt, maxPoints: pts, topic: newTopic.trim() || undefined }
                if (newType === "mcq") {
                  const options = newOptionsText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
                  if (options.length < 2) return alert("MCQ requires at least 2 options")
                  const correctTokens = newCorrectText.split(",").map((s) => s.trim()).filter(Boolean)
                  if (correctTokens.length === 0) return alert("Provide at least one correct answer")
                  const set = new Set(options)
                  for (const c of correctTokens) { if (!set.has(c)) return alert("Correct answers must be among options") }
                  const answer: string | string[] = correctTokens.length <= 1 ? (correctTokens[0] || "") : correctTokens
                  setItems((prev) => [...prev, { ...base, options, answer }])
                } else {
                  if (!newCorrectText.trim()) return alert("Reference/Exact answer is required")
                  setItems((prev) => [...prev, { ...base, answer: newCorrectText }])
                }
                setNewPrompt("")
                setNewOptionsText("")
                setNewCorrectText("")
                setNewMaxPoints(1)
                setNewTopic("")
              }}
            >
              Add Item
            </Button>
          </div>
          {items.length > 0 && (
            <div className="mt-3 grid gap-2">
              <div className="text-sm font-medium">Items</div>
              {items.map((it, idx) => (
                <div key={it.id} className="rounded border p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Q{idx + 1} · {it.type} · {it.maxPoints} pts</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        if (editingId === it.id) return
                        if (idx === 0) return
                        setItems((prev) => {
                          const arr = [...prev]
                          const tmp = arr[idx - 1]
                          arr[idx - 1] = arr[idx]
                          arr[idx] = tmp
                          return arr
                        })
                      }}>Up</Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        if (editingId === it.id) return
                        if (idx === items.length - 1) return
                        setItems((prev) => {
                          const arr = [...prev]
                          const tmp = arr[idx + 1]
                          arr[idx + 1] = arr[idx]
                          arr[idx] = tmp
                          return arr
                        })
                      }}>Down</Button>
                      {editingId === it.id ? (
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingId(null)
                          setEditPrompt("")
                          setEditMaxPoints(1)
                          setEditOptionsText("")
                          setEditAnswerText("")
                        }}>Cancel</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingId(it.id)
                          setEditPrompt(it.prompt)
                          setEditMaxPoints(it.maxPoints)
                          setEditOptionsText(Array.isArray(it.options) ? it.options.join("\n") : "")
                          setEditAnswerText(Array.isArray(it.answer) ? it.answer.join(",") : (it.answer || ""))
                          setEditTopic(it.topic || "")
                        }}>Edit</Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}>Remove</Button>
                    </div>
                  </div>
                  {editingId === it.id ? (
                    <div className="mt-2 grid gap-2">
                      <div className="grid gap-1">
                        <label className="text-xs">Prompt</label>
                        <Textarea value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs">Max Points</label>
                        <Input type="number" className="h-9" value={editMaxPoints} onChange={(e) => setEditMaxPoints(Number(e.target.value) || 1)} />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs">Topic (optional)</label>
                        <Input className="h-9" value={editTopic} onChange={(e) => setEditTopic(e.target.value)} />
                      </div>
                      {it.type === "mcq" && (
                        <>
                          <div className="grid gap-1">
                            <label className="text-xs">Options (one per line)</label>
                            <Textarea value={editOptionsText} onChange={(e) => setEditOptionsText(e.target.value)} />
                          </div>
                          <div className="grid gap-1">
                            <label className="text-xs">Answer(s) (comma-separated)</label>
                            <Input value={editAnswerText} onChange={(e) => setEditAnswerText(e.target.value)} />
                          </div>
                        </>
                      )}
                      {it.type !== "mcq" && (
                        <div className="grid gap-1">
                          <label className="text-xs">Reference/Exact Answer</label>
                          <Textarea value={editAnswerText} onChange={(e) => setEditAnswerText(e.target.value)} />
                        </div>
                      )}
                      <div>
                        <Button size="sm" onClick={() => {
                          setItems((prev) => prev.map((x) => {
                            if (x.id !== it.id) return x
                            const updated: BuilderItem = { ...x, prompt: editPrompt.trim(), maxPoints: Number(editMaxPoints) || 1, topic: editTopic.trim() || undefined }
                            if (x.type === "mcq") {
                              const options = editOptionsText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
                              const tokens = editAnswerText.split(",").map((s) => s.trim()).filter(Boolean)
                              ;(updated as any).options = options
                              ;(updated as any).answer = tokens.length <= 1 ? (tokens[0] || "") : tokens
                            } else {
                              ;(updated as any).answer = editAnswerText
                            }
                            return updated
                          }))
                          setEditingId(null)
                          setEditPrompt("")
                          setEditMaxPoints(1)
                          setEditOptionsText("")
                          setEditAnswerText("")
                          setEditTopic("")
                        }}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-1">{it.prompt}</div>
                      {it.topic && <div className="mt-1 text-xs text-muted-foreground">Topic: {it.topic}</div>}
                      {it.type === "mcq" && Array.isArray(it.options) && (
                        <div className="mt-1 grid gap-1">
                          {it.options.map((o) => (
                            <div key={o} className="text-xs">- {o}</div>
                          ))}
                          <div className="text-xs text-muted-foreground">Answer: {Array.isArray(it.answer) ? it.answer.join(", ") : it.answer}</div>
                        </div>
                      )}
                      {it.type !== "mcq" && (
                        <div className="mt-1 text-xs text-muted-foreground">Answer: {String(it.answer ?? "")}</div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            disabled={loading || !title || items.length === 0}
            onClick={async () => {
              setLoading(true)
              await fetch("/api/tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, questions, status: "draft", startAt, endAt, items }),
              })
              setTitle("")
              setDescription("")
              setQuestions("")
              setStartAt("")
              setEndAt("")
              setItems([])
              await loadTests()
              setLoading(false)
            }}
          >
            Save Draft
          </Button>
          <Button
            variant="outline"
            disabled={loading || !title || items.length === 0}
            onClick={async () => {
              setLoading(true)
              await fetch("/api/tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, questions, status: "published", startAt, endAt, items }),
              })
              setTitle("")
              setDescription("")
              setQuestions("")
              setStartAt("")
              setEndAt("")
              setItems([])
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
                <a
                  href={`/teacher/tests/${t._id}/analytics`}
                  className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                >
                  View Analytics
                </a>
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
                      {typeof s.totalScore === "number" && typeof s.maxScore === "number" && (
                        <span className="ml-2 text-xs text-muted-foreground">({s.totalScore}/{s.maxScore})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/teacher/submissions/${s._id}`}
                      className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                    >
                      Open Detail
                    </a>
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
                  <div className="mt-3 text-sm">
                    <div className="font-medium">Per-question results</div>
                    <div className="mt-1 grid gap-1">
                      {s.results.map((r: any, idx: number) => (
                        <div key={idx} className="rounded border px-2 py-1 text-xs">
                          <div className="flex items-center justify-between">
                            <div>Q{idx + 1}</div>
                            <div>
                              {typeof r.correct === "boolean" && (r.correct ? "Correct" : "Incorrect")}
                              {typeof r.similarity === "number" && ` · sim: ${r.similarity}`}
                              {` · ${r.score}/${r.maxPoints}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

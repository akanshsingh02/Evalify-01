"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ItemType = "mcq" | "short" | "descriptive"

interface TestItemDraft {
  id: string
  type: ItemType
  prompt: string
  options?: string[]
  answer?: string | string[]
  maxPoints: number
}

export function TeacherTestBuilder() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")
  const [items, setItems] = useState<TestItemDraft[]>([])
  const [saving, setSaving] = useState(false)

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "mcq", prompt: "", options: [""], answer: "", maxPoints: 1 },
    ])
  }

  function updateItem(idx: number, patch: Partial<TestItemDraft>) {
    setItems((prev) => Object.assign([...prev], { [idx]: { ...prev[idx], ...patch } }))
  }

  function addOption(idx: number) {
    const opts = Array.isArray(items[idx].options) ? items[idx].options!.slice() : []
    opts.push("")
    updateItem(idx, { options: opts })
  }

  function updateOption(idx: number, optIdx: number, value: string) {
    const opts = (items[idx].options || []).slice()
    opts[optIdx] = value
    updateItem(idx, { options: opts })
  }

  function removeOption(idx: number, optIdx: number) {
    const opts = (items[idx].options || []).slice()
    opts.splice(optIdx, 1)
    updateItem(idx, { options: opts })
  }

  function removeItem(idx: number) {
    const copy = items.slice()
    copy.splice(idx, 1)
    setItems(copy)
  }

  async function saveTest() {
    setSaving(true)
    const res = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status,
        startAt: startAt || null,
        endAt: endAt || null,
        items,
      }),
    })
    setSaving(false)
    if (!res.ok) return
    setTitle("")
    setDescription("")
    setItems([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Test</CardTitle>
        <CardDescription>Build tests with MCQ, short, and descriptive questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 md:grid-cols-2">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid gap-2 md:grid-cols-2">
          <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        </div>

        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={it.id} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Item {idx + 1}</div>
                <Button size="sm" variant="outline" onClick={() => removeItem(idx)}>Remove</Button>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <Select value={it.type} onValueChange={(v: any) => updateItem(idx, { type: v })}>
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">MCQ</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" min={1} value={it.maxPoints} onChange={(e) => updateItem(idx, { maxPoints: Number(e.target.value || 1) })} />
                <Input placeholder="Answer (for MCQ/short)" value={(it.answer as string) || ""} onChange={(e) => updateItem(idx, { answer: e.target.value })} />
              </div>
              <Textarea placeholder="Prompt" value={it.prompt} onChange={(e) => updateItem(idx, { prompt: e.target.value })} />
              {it.type === "mcq" && (
                <div className="space-y-2">
                  <div className="text-sm">Options</div>
                  {(it.options || []).map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-2">
                      <Input value={opt} onChange={(e) => updateOption(idx, oIdx, e.target.value)} />
                      <Button size="sm" variant="outline" onClick={() => removeOption(idx, oIdx)}>Remove</Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => addOption(idx)}>Add option</Button>
                </div>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addItem}>Add Item</Button>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveTest} disabled={!title || items.length === 0 || saving}>Save Test</Button>
        </div>
      </CardContent>
    </Card>
  )
}



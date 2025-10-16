"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TeacherTestsPanel() {
  const [tests, setTests] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [paperUrl, setPaperUrl] = useState("")
  const [scheduleAt, setScheduleAt] = useState("")
  const [loading, setLoading] = useState(false)

  async function loadTests() {
    const res = await fetch("/api/teacher/tests")
    if (!res.ok) return
    const data = await res.json()
    setTests(data.items || [])
  }

  useEffect(() => {
    loadTests()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tests</CardTitle>
        <CardDescription>Create tests and upload papers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 md:grid-cols-4">
          <Input placeholder="Test title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Paper URL (optional)" value={paperUrl} onChange={(e) => setPaperUrl(e.target.value)} />
          <Input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
          <Button
            disabled={!title || loading}
            onClick={async () => {
              setLoading(true)
              const res = await fetch("/api/teacher/tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, paperUrl, scheduleAt: scheduleAt ? new Date(scheduleAt) : undefined }),
              })
              setLoading(false)
              if (!res.ok) return
              setTitle("")
              setPaperUrl("")
              setScheduleAt("")
              loadTests()
            }}
          >
            Create
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Paper</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.paperUrl ? <a className="underline" href={t.paperUrl}>Open</a> : "-"}</TableCell>
                  <TableCell>{t.scheduleAt ? new Date(t.scheduleAt).toLocaleString() : "-"}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}



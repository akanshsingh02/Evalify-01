"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StudentAssignmentsPanel() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [loading, setLoading] = useState(false)

  async function loadAssignments() {
    const res = await fetch("/api/student/assignments")
    if (!res.ok) return
    const data = await res.json()
    setAssignments(data.items || [])
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Assignments</CardTitle>
        <CardDescription>Create and view your assignments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Assignment title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="File URL (optional)" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
          <Button
            disabled={!title || loading}
            onClick={async () => {
              setLoading(true)
              const res = await fetch("/api/student/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, fileUrl }),
              })
              setLoading(false)
              if (!res.ok) return
              setTitle("")
              setFileUrl("")
              loadAssignments()
            }}
          >
            Add
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.fileUrl ? <a className="underline" href={a.fileUrl}>Open</a> : "-"}</TableCell>
                  <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}



"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

const submissions = [
  { id: "RPT-1001", subject: "Mathematics", date: "2025-09-12", status: "Evaluated", score: 84, plag: 2 },
  { id: "RPT-1002", subject: "Physics", date: "2025-09-18", status: "Pending", score: "-", plag: 0 },
  { id: "RPT-1003", subject: "Chemistry", date: "2025-10-01", status: "Re-evaluated", score: 88, plag: 1 },
]

export default function StudentDashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-lift animate-fade-in-up">
          <CardHeader>
            <CardTitle>Upload Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <img
              src="/assignment-upload-illustration.jpg"
              alt="Illustration of uploading an assignment"
              className="h-auto w-full rounded-md border"
              loading="lazy"
            />
            <div className="rounded-md border bg-muted p-6 text-center text-sm text-muted-foreground">
              Drag & drop files here (placeholder)
            </div>
            <Button variant="outline" className="hover-lift bg-transparent">
              Browse Files
            </Button>
          </CardContent>
        </Card>
        <Card className="hover-lift animate-fade-in-up [animation-delay:120ms]">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-sm">
            <div className="animate-fade-in-up">
              <div className="text-muted-foreground">Solved</div>
              <div className="text-xl font-semibold">24</div>
            </div>
            <div className="animate-fade-in-up [animation-delay:120ms]">
              <div className="text-muted-foreground">Accuracy</div>
              <div className="text-xl font-semibold">82%</div>
            </div>
            <div className="animate-fade-in-up [animation-delay:200ms]">
              <div className="text-muted-foreground">Hints</div>
              <div className="text-xl font-semibold">12</div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift animate-fade-in-up [animation-delay:300ms]">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-2/3 rounded-full bg-primary transition-all duration-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <PerformanceChart />

      <Card>
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Plagiarism</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s) => (
                  <TableRow key={s.id} className="transition-colors hover:bg-accent/50">
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.date}</TableCell>
                    <TableCell>{s.subject}</TableCell>
                    <TableCell>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell>{s.score}</TableCell>
                    <TableCell>{s.plag}%</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/report/${s.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

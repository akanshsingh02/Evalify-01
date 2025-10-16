"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function StudentTestsList() {
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/tests?scope=student")
      const data = await res.json().catch(() => ({ tests: [] }))
      setTests(Array.isArray(data.tests) ? data.tests : [])
    })()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Tests</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {tests.map((t: any) => (
          <div key={t._id} className="rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.description}</div>
              </div>
              <Button
                size="sm"
                disabled={loading}
                onClick={async () => {
                  setLoading(true)
                  await fetch(`/api/tests/${t._id}/submissions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ answers: ["A", "B", "C"] }),
                  })
                  setLoading(false)
                }}
              >
                Submit Answers
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

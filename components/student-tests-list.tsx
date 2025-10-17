"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function StudentTestsList() {
  const [tests, setTests] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/tests")
      if (!res.ok) return
      const data = await res.json()
      setTests(data.items || [])
    })()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tests.length === 0 ? <div className="text-sm text-muted-foreground">No tests available</div> : null}
        {tests.map((t) => (
          <div key={t._id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-muted-foreground">
                {t.startAt ? new Date(t.startAt).toLocaleString() : "Any time"}
              </div>
            </div>
            <Button asChild size="sm">
              <Link href={`/tests/${t._id}`}>Take Test</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

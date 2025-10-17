"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PerformanceSummary() {
  const [data, setData] = useState<{ avg: number; max: number; min: number; count: number } | null>(null)

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/reports/summary")
      if (!res.ok) return
      const json = await res.json()
      setData(json)
    })()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <div className="text-xs text-muted-foreground">Average</div>
          <div className="text-xl font-semibold">{data ? Math.round(data.avg) : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Highest</div>
          <div className="text-xl font-semibold">{data ? data.max : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Lowest</div>
          <div className="text-xl font-semibold">{data ? data.min : "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Attempts</div>
          <div className="text-xl font-semibold">{data ? data.count : "-"}</div>
        </div>
      </CardContent>
    </Card>
  )
}



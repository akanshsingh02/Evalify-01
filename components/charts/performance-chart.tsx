"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

const data = [
  { week: "W1", score: 62 },
  { week: "W2", score: 68 },
  { week: "W3", score: 71 },
  { week: "W4", score: 77 },
  { week: "W5", score: 80 },
  { week: "W6", score: 84 },
]

export function PerformanceChart() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      const set = () => setReduced(mq.matches)
      set()
      mq.addEventListener?.("change", set)
      return () => mq.removeEventListener?.("change", set)
    }
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="oklch(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={!reduced}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

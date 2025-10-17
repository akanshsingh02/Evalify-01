"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"

export function TeacherAnalyticsCharts({ summary, topics }: { summary: any, topics: Array<{ topic: string, avgPercent: number, correctRate?: number, totalQuestions?: number }> }) {
  const topicData = (topics || []).map(t => ({ name: t.topic, avg: t.avgPercent || 0, correct: t.correctRate || 0 }))
  const summaryData = [
    { name: "Avg", value: Math.round((summary?.avg || 0) * 10) / 10 },
    { name: "Max", value: summary?.max || 0 },
    { name: "Min", value: summary?.min || 0 },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Topic-wise Average (%)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="avg" fill="oklch(var(--chart-1))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Score Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="oklch(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

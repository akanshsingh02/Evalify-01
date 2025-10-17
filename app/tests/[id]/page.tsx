"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function TakeTestPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [test, setTest] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`/api/tests/${params.id}`)
      if (!res.ok) return
      const data = await res.json()
      setTest(data.item)
      setAnswers((data.item?.items || []).map(() => ""))
    })()
  }, [params.id])

  if (!test) return null

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{test.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(test.items || []).map((q: any, i: number) => (
            <div key={q.id || i} className="space-y-2">
              <div className="font-medium">Q{i + 1}. {q.prompt}</div>
              {q.type === "mcq" ? (
                <div className="grid gap-2">
                  {(q.options || []).map((opt: string) => (
                    <label key={opt} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q_${i}`}
                        value={opt}
                        checked={answers[i] === opt}
                        onChange={() => setAnswers((a) => Object.assign([...a], { [i]: opt }))}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : q.type === "short" ? (
                <Input value={answers[i] || ""} onChange={(e) => setAnswers((a) => Object.assign([...a], { [i]: e.target.value }))} />
              ) : (
                <Textarea value={answers[i] || ""} onChange={(e) => setAnswers((a) => Object.assign([...a], { [i]: e.target.value }))} />
              )}
            </div>
          ))}
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              const res = await fetch(`/api/tests/${params.id}/submissions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
              })
              setLoading(false)
              if (!res.ok) return
              router.push("/student")
            }}
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}



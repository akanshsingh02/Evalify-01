"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function StudentTestTaker({ test }: { test: any }) {
  const [answers, setAnswers] = useState<any[]>(Array((test?.items || []).length).fill(""))
  const [submitting, setSubmitting] = useState(false)

  function setAns(index: number, value: any) {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">{test.title}</h2>
        {test.description && <div className="text-sm text-muted-foreground">{test.description}</div>}
      </div>
      <div className="grid gap-4">
        {(test.items || []).map((it: any, i: number) => (
          <div key={it.id || i} className="rounded-md border p-3">
            <div className="font-medium">Q{i + 1}. {it.prompt}</div>
            {it.type === "mcq" && Array.isArray(it.options) && (
              <div className="mt-2 grid gap-2">
                {it.options.map((opt: string) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type={Array.isArray(it.answer) ? "checkbox" : "radio"}
                      name={`q-${i}`}
                      value={opt}
                      onChange={(e) => {
                        if (Array.isArray(it.answer)) {
                          const set = new Set(answers[i] || [])
                          if (e.target.checked) set.add(opt)
                          else set.delete(opt)
                          setAns(i, Array.from(set))
                        } else {
                          setAns(i, opt)
                        }
                      }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {it.type === "short" && (
              <input
                className="mt-2 h-9 w-full rounded-md border px-2 text-sm"
                placeholder="Your answer"
                value={answers[i] || ""}
                onChange={(e) => setAns(i, e.target.value)}
              />
            )}
            {it.type === "descriptive" && (
              <textarea
                className="mt-2 w-full rounded-md border p-2 text-sm"
                rows={4}
                placeholder="Your answer"
                value={answers[i] || ""}
                onChange={(e) => setAns(i, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div>
        <Button
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true)
            await fetch(`/api/tests/${test._id}/submissions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers }),
            })
            window.location.href = "/student/submissions"
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

type AIResult = {
  similarity?: number
  feedback?: string
  hints?: string[]
  plagiarismScore?: number
}

async function callGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
            role: "user",
          },
        ],
      }),
    })
    const data = await res.json().catch(() => null)
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    return typeof text === "string" ? text : null
  } catch {
    return null
  }
}

async function callGrok(prompt: string): Promise<string | null> {
  const key = process.env.GROK_API_KEY
  if (!key) return null
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    })
    const data = await res.json().catch(() => null)
    const text = data?.choices?.[0]?.message?.content
    return typeof text === "string" ? text : null
  } catch {
    return null
  }
}

export async function aiEvaluateSubjective(expected: string, actual: string): Promise<AIResult> {
  const basePrompt = `You are grading a descriptive answer.
Expected key points: """${expected}"""
Student answer: """${actual}"""
Tasks:
- Score similarity 0..1 (float)
- Provide 2-3 sentence feedback
- Provide up to 2 short hints for improvements
Return strict JSON with keys: similarity (number 0..1), feedback (string), hints (string[]).`

  const gem = await callGemini(basePrompt)
  const grok = gem ? null : await callGrok(basePrompt)
  const txt = gem || grok
  if (txt) {
    try {
      const json = JSON.parse(txt)
      return {
        similarity: typeof json.similarity === "number" ? json.similarity : undefined,
        feedback: typeof json.feedback === "string" ? json.feedback : undefined,
        hints: Array.isArray(json.hints) ? json.hints.slice(0, 3) : undefined,
      }
    } catch {}
  }
  return {}
}

export async function aiPlagiarismScore(text: string): Promise<number | undefined> {
  const prompt = `Estimate plagiarism risk (0..1). Consider generic phrasing low risk. Text: """${text}""". Return JSON {"plagiarism": number}`
  const gem = await callGemini(prompt)
  const grok = gem ? null : await callGrok(prompt)
  const txt = gem || grok
  if (txt) {
    try {
      const json = JSON.parse(txt)
      if (typeof json.plagiarism === "number") return json.plagiarism
    } catch {}
  }
  return undefined
}



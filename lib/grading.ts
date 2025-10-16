export type ItemType = "mcq" | "short" | "descriptive"

export interface TestItem {
  id: string
  type: ItemType
  prompt: string
  options?: string[]
  answer?: string | string[]
  maxPoints: number
}

export interface GradeResult {
  score: number
  maxPoints: number
  correct?: boolean
  similarity?: number
}

function normalizeText(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim()
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>) {
  let dot = 0
  let na = 0
  let nb = 0
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const k of keys) {
    const va = a[k] || 0
    const vb = b[k] || 0
    dot += va * vb
    na += va * va
    nb += vb * vb
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

function bagOfWords(text: string) {
  const tokens = normalizeText(text).split(" ").filter(Boolean)
  const counts: Record<string, number> = {}
  for (const tok of tokens) counts[tok] = (counts[tok] || 0) + 1
  return counts
}

function gradeMCQ(item: TestItem, answer: string | string[] | undefined): GradeResult {
  const correct = Array.isArray(item.answer)
    ? Array.isArray(answer) && item.answer.length === answer.length && item.answer.every((a) => (answer as string[]).includes(a))
    : String(answer ?? "") === String(item.answer ?? "")
  return { score: correct ? item.maxPoints : 0, maxPoints: item.maxPoints, correct }
}

function gradeShort(item: TestItem, answer: string | undefined): GradeResult {
  const normA = normalizeText(String(answer ?? ""))
  const normKey = normalizeText(String(item.answer ?? ""))
  const correct = normA === normKey
  return { score: correct ? item.maxPoints : 0, maxPoints: item.maxPoints, correct }
}

function gradeDescriptive(item: TestItem, answer: string | undefined): GradeResult {
  const a = bagOfWords(String(answer ?? ""))
  const k = bagOfWords(String(item.answer ?? ""))
  const sim = cosineSimilarity(a, k)
  // Map similarity [0,1] to score [0, maxPoints]
  const score = Math.round(sim * item.maxPoints)
  return { score, maxPoints: item.maxPoints, similarity: Number(sim.toFixed(3)) }
}

export function gradeAnswers(items: TestItem[], answers: Array<string | string[] | undefined>) {
  const results: GradeResult[] = []
  let total = 0
  let max = 0
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const ans = answers[i]
    let r: GradeResult
    if (it.type === "mcq") r = gradeMCQ(it, ans as any)
    else if (it.type === "short") r = gradeShort(it, ans as any)
    else r = gradeDescriptive(it, ans as any)
    results.push(r)
    total += r.score
    max += r.maxPoints
  }
  return { results, totalScore: total, maxScore: max }
}

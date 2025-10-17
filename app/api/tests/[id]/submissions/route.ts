import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"
import { TestModel, type TestDoc, type TestItem } from "@/models/test"
import { requireRole } from "@/lib/authz"
import { aiEvaluateSubjective, aiPlagiarismScore } from "@/lib/ai"

function normalize(s?: string) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ")
}

function scoreSubjective(expected: string | undefined, actual: string | undefined): number {
  if (!expected || !actual) return 0
  const a = normalize(actual)
  const e = normalize(expected)
  if (!a || !e) return 0
  const aWords = new Set(a.split(" "))
  const eWords = new Set(e.split(" "))
  let overlap = 0
  eWords.forEach((w) => {
    if (aWords.has(w)) overlap++
  })
  return overlap / Math.max(1, eWords.size)
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await requireRole(["student", "admin"])
    const { answers } = await req.json()
    if (!Array.isArray(answers)) return NextResponse.json({ error: "answers array required" }, { status: 400 })

    await connectToDatabase()
    const test = (await TestModel.findById(params.id).lean()) as TestDoc | null
    if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 })

    let total = 0
    let max = 0
    const results: Array<{ score: number; maxPoints: number; correct?: boolean; similarity?: number; feedback?: string; hints?: string[] }> = []
    ;(test.items || []).forEach((item: TestItem, idx: number) => {
      const given = answers[idx]
      const mp = item.maxPoints || 1
      max += mp
      if (item.type === "mcq" || item.type === "short") {
        const correct = Array.isArray(item.answer)
          ? Array.isArray(given) && normalize(given.join(",")) === normalize((item.answer as string[]).join(","))
          : normalize(String(given || "")) === normalize(String(item.answer || ""))
        const sc = correct ? mp : 0
        total += sc
        results.push({ score: sc, maxPoints: mp, correct })
      } else if (item.type === "descriptive") {
        const expected = String(item.answer || "")
        const actual = String(given || "")
        const ai = await aiEvaluateSubjective(expected, actual)
        const sim = typeof ai.similarity === "number" ? ai.similarity : scoreSubjective(expected, actual)
        const sc = Math.round(sim * mp)
        total += sc
        results.push({ score: sc, maxPoints: mp, similarity: sim, feedback: ai.feedback, hints: ai.hints })
      }
    })

    const textForPlag = (answers || []).filter((a: any) => typeof a === "string").join("\n")
    const plag = await aiPlagiarismScore(textForPlag)

    const created = await SubmissionModel.create({
      testId: params.id,
      studentId: (session.user as any).id,
      answers,
      score: total,
      totalScore: total,
      maxScore: max,
      autoGraded: true,
      status: "Evaluated",
      results,
      attachments: [],
    })

    return NextResponse.json({ item: created, plagiarism: plag })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to submit" }, { status: code })
  }
}

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"
import { TestModel } from "@/models/test"
import { gradeAnswers } from "@/lib/grading"
import { saveBlobToUploads } from "@/lib/storage"
import { PerformanceModel } from "@/models/performance"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET(req: Request, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params
    if (!id) return NextResponse.json({ error: "Missing test id" }, { status: 400 })
    await connectToDatabase()
    const url = new URL(req.url)
    const scope = url.searchParams.get("scope") || "teacher"
    if (scope === "student") {
      const submissions = await SubmissionModel.find({ testId: id, studentId: (session.user as any).id }).lean()
      return NextResponse.json({ submissions })
    }
    const submissions = await SubmissionModel.find({ testId: id }).lean()
    return NextResponse.json({ submissions })
  } catch (e) {
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params
    if (!id) return NextResponse.json({ error: "Missing test id" }, { status: 400 })
    await connectToDatabase()
    const ct = req.headers.get("content-type") || ""
    let answers: any[] | null = null
    let attachments: string[] = []
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData()
      const rawAnswers = form.get("answers")
      if (typeof rawAnswers === "string") {
        try { answers = JSON.parse(rawAnswers) } catch { answers = null }
      }
      const files = form.getAll("files")
      for (const f of files) {
        if (f instanceof File) {
          const saved = await saveBlobToUploads(f, f.name)
          attachments.push(saved)
        }
      }
    } else {
      const body = await req.json().catch(() => null)
      if (Array.isArray(body?.answers)) answers = body.answers
    }
    if (!Array.isArray(answers)) return NextResponse.json({ error: "answers required" }, { status: 400 })
    const test = await TestModel.findById(id).lean()
    let score = 0
    let results: any[] = []
    let totalScore: number | undefined
    let maxScore: number | undefined
    if (test && Array.isArray(test.items) && test.items.length > 0) {
      const graded = gradeAnswers(test.items as any, answers)
      results = graded.results
      totalScore = graded.totalScore
      maxScore = graded.maxScore
      score = totalScore
    } else {
      score = Math.floor(Math.random() * 41) + 60
    }
    const doc = await SubmissionModel.create({
      testId: id,
      studentId: (session.user as any).id,
      answers,
      score,
      results,
      totalScore,
      maxScore,
      autoGraded: true,
      attachments,
    })
    try {
      if (test && Array.isArray(test.items) && Array.isArray(results) && typeof totalScore === "number" && typeof maxScore === "number") {
        const topicMap: Record<string, { score: number; max: number; correct: number; total: number }> = {}
        for (let i = 0; i < (test.items as any[]).length; i++) {
          const item: any = (test.items as any[])[i]
          const r: any = results[i]
          if (!r) continue
          const topic = (item?.topic as string) || "General"
          if (!topicMap[topic]) topicMap[topic] = { score: 0, max: 0, correct: 0, total: 0 }
          topicMap[topic].score += Number(r.score || 0)
          topicMap[topic].max += Number(r.maxPoints || 0)
          topicMap[topic].total += 1
          if (typeof r.correct === "boolean" && r.correct) topicMap[topic].correct += 1
        }
        const topics = Object.entries(topicMap).map(([topic, v]) => ({ topic, score: v.score, maxScore: v.max, correctCount: v.correct, totalCount: v.total }))
        await PerformanceModel.create({
          studentId: (session.user as any).id,
          testId: id,
          submissionId: String(doc._id),
          score: totalScore,
          maxScore: maxScore,
          topics,
        })
      }
    } catch {}
    return NextResponse.json({ submission: { id: String(doc._id) } }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}

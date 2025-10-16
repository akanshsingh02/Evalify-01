import { NextResponse } from "next/server"
import { requireRole } from "@/lib/authz"
import { connectToDatabase } from "@/lib/mongodb"
import { TestModel } from "@/models/test"
import { PerformanceModel } from "@/models/performance"
import { SubmissionModel } from "@/models/submission"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET(_req: Request, { params }: { params: { id?: string } }) {
  try {
    const session = await requireRole(["teacher", "admin"])
    const id = params?.id
    if (!id) return NextResponse.json({ error: "Missing test id" }, { status: 400 })
    await connectToDatabase()
    const test = await TestModel.findById(id).lean()
    if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const role = (session.user as any)?.role as string
    if (role === "teacher" && test.teacherId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const perfs = await PerformanceModel.find({ testId: id }).lean()
    let count = perfs.length
    let avg = 0, min = Infinity, max = -Infinity
    let topicMap: Record<string, { score: number; max: number; correct: number; total: number }> = {}
    if (count > 0) {
      for (const p of perfs as any[]) {
        avg += p.score
        if (p.score < min) min = p.score
        if (p.score > max) max = p.score
        for (const t of p.topics || []) {
          if (!topicMap[t.topic]) topicMap[t.topic] = { score: 0, max: 0, correct: 0, total: 0 }
          topicMap[t.topic].score += Number(t.score || 0)
          topicMap[t.topic].max += Number(t.maxScore || 0)
          topicMap[t.topic].correct += Number(t.correctCount || 0)
          topicMap[t.topic].total += Number(t.totalCount || 0)
        }
      }
      avg = count ? avg / count : 0
    } else {
      // Fallback to submissions if performance missing
      const subs = await SubmissionModel.find({ testId: id }).lean()
      count = subs.length
      for (const s of subs as any[]) {
        const sc = Number(s.overriddenScore ?? s.score ?? 0)
        avg += sc
        if (sc < min) min = sc
        if (sc > max) max = sc
      }
      avg = count ? avg / count : 0
      if (!isFinite(min)) min = 0
      if (!isFinite(max)) max = 0
    }
    const topics = Object.entries(topicMap).map(([topic, v]) => ({
      topic,
      avgPercent: v.max > 0 ? Math.round((v.score / v.max) * 1000) / 10 : 0,
      correctRate: v.total > 0 ? Math.round((v.correct / v.total) * 1000) / 10 : 0,
      totalQuestions: v.total,
    }))
    return NextResponse.json({ summary: { count, avg, min: isFinite(min) ? min : 0, max: isFinite(max) ? max : 0 }, topics })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to compute analytics" }, { status: code })
  }
}

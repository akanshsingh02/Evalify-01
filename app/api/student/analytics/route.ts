import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { PerformanceModel } from "@/models/performance"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    await connectToDatabase()
    const uid = (session.user as any).id
    const perfs = await PerformanceModel.find({ studentId: uid }).sort({ createdAt: -1 }).lean()
    const history = perfs.map((p: any) => ({
      id: String(p._id),
      testId: p.testId,
      score: p.score,
      maxScore: p.maxScore,
      percent: p.maxScore > 0 ? Math.round((p.score / p.maxScore) * 1000) / 10 : 0,
      createdAt: p.createdAt,
    }))
    const topicMap: Record<string, { score: number; max: number }> = {}
    for (const p of perfs as any[]) {
      for (const t of p.topics || []) {
        if (!topicMap[t.topic]) topicMap[t.topic] = { score: 0, max: 0 }
        topicMap[t.topic].score += Number(t.score || 0)
        topicMap[t.topic].max += Number(t.maxScore || 0)
      }
    }
    const topics = Object.entries(topicMap).map(([topic, v]) => ({
      topic,
      avgPercent: v.max > 0 ? Math.round((v.score / v.max) * 1000) / 10 : 0,
    }))
    return NextResponse.json({ history, topics })
  } catch (e) {
    return NextResponse.json({ error: "Failed to compute analytics" }, { status: 500 })
  }
}

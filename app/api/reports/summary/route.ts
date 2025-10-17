import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"
import { requireAuth } from "@/lib/authz"

export async function GET() {
  try {
    const session = await requireAuth()
    await connectToDatabase()
    const uid = (session.user as any).id
    const role = (session.user as any).role
    const match: any = role === "student" ? { studentId: uid } : {}
    const docs = await SubmissionModel.find(match).lean()
    if (docs.length === 0) return NextResponse.json({ avg: 0, max: 0, min: 0, count: 0 })
    const scores = docs.map((d) => d.totalScore ?? d.score ?? 0)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const max = Math.max(...scores)
    const min = Math.min(...scores)
    return NextResponse.json({ avg, max, min, count: scores.length })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}



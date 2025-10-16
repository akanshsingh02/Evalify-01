import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"
import { TestModel } from "@/models/test"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDatabase()
  const studentId = (session.user as any).id
  const subs = await SubmissionModel.find({ studentId }).sort({ createdAt: -1 }).lean()
  const testIds = [...new Set(subs.map((s: any) => s.testId))]
  const tests = await TestModel.find({ _id: { $in: testIds } }, { title: 1 }).lean()
  const testMap = new Map<string, string>(tests.map((t: any) => [String(t._id), t.title]))
  const items = subs.map((s: any) => ({
    _id: String(s._id),
    testId: s.testId,
    testTitle: testMap.get(String(s.testId)) || "",
    score: s.overriddenScore ?? s.score ?? null,
    overridden: typeof s.overriddenScore === "number",
    autoGraded: !!s.autoGraded,
    createdAt: s.createdAt,
  }))
  return NextResponse.json({ submissions: items })
}

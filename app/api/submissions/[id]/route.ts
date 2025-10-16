import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"
import { TestModel } from "@/models/test"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET(_req: Request, { params }: { params: { id?: string } }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const id = params?.id
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    await connectToDatabase()
    const sub = await SubmissionModel.findById(id).lean()
    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const role = (session.user as any)?.role as string
    const uid = (session.user as any).id
    if (role === "student" && sub.studentId !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    let test: any = null
    if (sub.testId) {
      test = await TestModel.findById(sub.testId).lean()
      if (role === "teacher" && test && test.teacherId !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ submission: sub, test })
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 })
  }
}

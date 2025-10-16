import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"

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
    const body = await req.json().catch(() => null)
    if (!Array.isArray(body?.answers)) return NextResponse.json({ error: "answers required" }, { status: 400 })
    const score = Math.floor(Math.random() * 41) + 60
    const doc = await SubmissionModel.create({
      testId: id,
      studentId: (session.user as any).id,
      answers: body.answers,
      score,
      autoGraded: true,
    })
    return NextResponse.json({ submission: { id: String(doc._id) } }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}

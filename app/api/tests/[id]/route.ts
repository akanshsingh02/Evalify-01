import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { TestModel } from "@/models/test"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET(_: Request, context: { params: Promise<{ id?: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing test id" }, { status: 400 })
    await connectToDatabase()
    const test = await TestModel.findById(id).lean()
    if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const role = (session.user as any)?.role as string
    if (role === "student" && test.status !== "published") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    if (role === "teacher" && test.teacherId !== (session.user as any).id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    return NextResponse.json({ test })
  } catch (e) {
    return NextResponse.json({ error: "Failed to load test" }, { status: 500 })
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id?: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const role = (session.user as any)?.role as string
    const { id } = await context.params
    if (!id) return NextResponse.json({ error: "Missing test id" }, { status: 400 })
    await connectToDatabase()
    const body = await req.json().catch(() => null)
    const test = await TestModel.findById(id)
    if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (!(role === "admin" || (role === "teacher" && test.teacherId === (session.user as any).id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    if (typeof body?.title === "string") test.title = body.title
    if (typeof body?.description === "string") test.description = body.description
    if (Array.isArray(body?.questions)) test.questions = body.questions
    if (typeof body?.status === "string" && ["draft", "published"].includes(body.status)) test.status = body.status
    if (Object.prototype.hasOwnProperty.call(body || {}, "startAt")) {
      test.startAt = body.startAt ? new Date(body.startAt) : null
    }
    if (Object.prototype.hasOwnProperty.call(body || {}, "endAt")) {
      test.endAt = body.endAt ? new Date(body.endAt) : null
    }
    await test.save()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to update test" }, { status: 500 })
  }
}

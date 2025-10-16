import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { TestModel } from "@/models/test"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET(req: Request) {
  const session = await auth()
  const url = new URL(req.url)
  const scope = url.searchParams.get("scope") || "all"
  await connectToDatabase()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const role = (session.user as any)?.role as string
  if (role === "admin") {
    const tests = await TestModel.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ tests })
  }
  if (role === "teacher") {
    const tests = await TestModel.find({ teacherId: (session.user as any).id }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ tests })
  }
  if (role === "student") {
    const now = new Date()
    const tests = await TestModel.find({
      status: "published",
      $and: [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
      ],
    })
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json({ tests })
  }
  return NextResponse.json({ tests: [] })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const role = (session.user as any)?.role as string
  if (!["teacher", "admin"].includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const body = await req.json().catch(() => null)
  if (!body?.title) return NextResponse.json({ error: "Title required" }, { status: 400 })
  await connectToDatabase()
  const doc = await TestModel.create({
    title: body.title,
    description: body.description || "",
    questions: Array.isArray(body.questions) ? body.questions : typeof body.questions === "string" ? body.questions.split("\n").filter(Boolean) : [],
    teacherId: (session.user as any).id,
    status: body.status === "published" ? "published" : "draft",
    startAt: body.startAt ? new Date(body.startAt) : null,
    endAt: body.endAt ? new Date(body.endAt) : null,
    items: Array.isArray(body.items) ? body.items : [],
  })
  return NextResponse.json({ test: { id: String(doc._id) } }, { status: 201 })
}

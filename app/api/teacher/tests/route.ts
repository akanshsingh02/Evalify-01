import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { TestModel } from "@/models/test"
import { requireRole } from "@/lib/authz"

export async function GET() {
  try {
    const session = await requireRole(["teacher", "admin"])
    await connectToDatabase()
    const list = await TestModel.find({ teacherId: (session.user as any).id }).sort({ createdAt: -1 })
    return NextResponse.json({ items: list })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: code })
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(["teacher", "admin"])
    const body = await req.json()
    const { title, paperUrl, scheduleAt } = body || {}
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })
    await connectToDatabase()
    const doc = await TestModel.create({ teacherId: (session.user as any).id, title, paperUrl, scheduleAt })
    return NextResponse.json({ item: doc })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to create test" }, { status: code })
  }
}



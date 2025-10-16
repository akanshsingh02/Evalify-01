import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { AssignmentModel } from "@/models/assignment"
import { requireRole } from "@/lib/authz"

export async function GET() {
  try {
    const session = await requireRole(["student", "admin"])
    await connectToDatabase()
    const list = await AssignmentModel.find({ studentId: (session.user as any).id }).sort({ createdAt: -1 })
    return NextResponse.json({ items: list })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: code })
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(["student", "admin"])
    const body = await req.json()
    const { title, fileUrl } = body || {}
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })
    await connectToDatabase()
    const doc = await AssignmentModel.create({ studentId: (session.user as any).id, title, fileUrl })
    return NextResponse.json({ item: doc })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to create assignment" }, { status: code })
  }
}



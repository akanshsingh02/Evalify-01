import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const role = (session.user as any)?.role as string
  if (!["teacher", "admin"].includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await connectToDatabase()
  const body = await req.json().catch(() => null)
  if (typeof body?.score !== "number") return NextResponse.json({ error: "score required" }, { status: 400 })
  const sub = await SubmissionModel.findById(params.id)
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 })
  sub.overriddenScore = body.score
  await sub.save()
  return NextResponse.json({ ok: true })
}

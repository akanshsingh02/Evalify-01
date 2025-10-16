import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/models/user"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function PATCH(req: Request, { params }: { params: Promise<{ id?: string }> }) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const body = await req.json().catch(() => null)
  if (!body || typeof body.role !== "string" || !["student", "teacher", "admin"].includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }
  await connectToDatabase()
  await UserModel.updateOne({ _id: id }, { $set: { role: body.role } })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id?: string }> }) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await connectToDatabase()
  await UserModel.deleteOne({ _id: id })
  return NextResponse.json({ ok: true })
}

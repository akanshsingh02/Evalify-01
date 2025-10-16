import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/models/user"
import { requireRole } from "@/lib/authz"

export async function GET() {
  try {
    await requireRole(["admin"])
    await connectToDatabase()
    const users = await UserModel.find({}).select("name email role")
    return NextResponse.json({ items: users })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to fetch users" }, { status: code })
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole(["admin"])
    const { userId, role } = await req.json()
    if (!userId || !role) return NextResponse.json({ error: "userId and role required" }, { status: 400 })
    await connectToDatabase()
    await UserModel.findByIdAndUpdate(userId, { $set: { role } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to update user" }, { status: code })
  }
}

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/models/user"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await connectToDatabase()
  const users = await UserModel.find({}, { password: 0 }).sort({ createdAt: -1 }).lean().catch(() => [])
  return NextResponse.json({ users })
}

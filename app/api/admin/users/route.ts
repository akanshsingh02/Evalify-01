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

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/models/user"
import bcrypt from "bcryptjs"
import type { AppUserRole } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const { name, email, password, role }: { name?: string; email: string; password: string; role?: AppUserRole } =
      await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await connectToDatabase()
    const existing = await UserModel.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }
    const hashed = await bcrypt.hash(password, 10)
    await UserModel.create({ name, email, password: hashed, role: role || "student" })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}



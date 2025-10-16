import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { SettingModel } from "@/models/setting"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await connectToDatabase()
  let doc: any = await SettingModel.findOne({}).lean<any>()
  if (!doc) {
    const created = await SettingModel.create({})
    doc = (created.toObject() as any)
  }
  return NextResponse.json({ settings: doc })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const body = await req.json().catch(() => null)
  await connectToDatabase()
  const update: any = { updatedAt: new Date() }
  if (body && typeof body.siteName === "string") update.siteName = body.siteName
  if (body && typeof body.maintenanceMode === "boolean") update.maintenanceMode = body.maintenanceMode
  const doc = await SettingModel.findOneAndUpdate({}, { $set: update }, { upsert: true, new: true }).lean()
  return NextResponse.json({ settings: doc })
}

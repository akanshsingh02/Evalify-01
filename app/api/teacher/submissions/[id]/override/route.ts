import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { SubmissionModel } from "@/models/submission"
import { requireRole } from "@/lib/authz"

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireRole(["teacher", "admin"])
    const { score, status } = await req.json()
    await connectToDatabase()
    const updated = await SubmissionModel.findByIdAndUpdate(
      params.id,
      { $set: { score, status: status || "Re-evaluated" } },
      { new: true },
    )
    return NextResponse.json({ item: updated })
  } catch (e: any) {
    const code = e?.message === "UNAUTHORIZED" ? 401 : e?.message === "FORBIDDEN" ? 403 : 500
    return NextResponse.json({ error: "Failed to override" }, { status: code })
  }
}



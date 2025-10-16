import { auth } from "@/auth"
import { TestModel } from "@/models/test"
import { connectToDatabase } from "@/lib/mongodb"
import { StudentTestTaker } from "@/components/student-test-taker"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function StudentTestPage({ params }: { params: Promise<{ id?: string }> }) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["student", "admin"].includes(role)) {
    return null
  }
  const { id } = await params
  if (!id) return null
  await connectToDatabase()
  const test = await TestModel.findById(id).lean()
  if (!test) return null
  return <StudentTestTaker test={{ ...test, _id: String(test._id) }} />
}

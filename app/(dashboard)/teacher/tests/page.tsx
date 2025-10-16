import { auth } from "@/auth"
import { TeacherManager } from "@/components/teacher-manager"

export default async function TeacherTestsPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["teacher", "admin"].includes(role)) {
    return null
  }
  return <TeacherManager />
}

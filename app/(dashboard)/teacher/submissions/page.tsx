import { auth } from "@/auth"
import { TeacherManager } from "@/components/teacher-manager"

export default async function TeacherSubmissionsPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || !["teacher", "admin"].includes(role)) {
    return null
  }
  // TeacherManager includes a per-test submissions viewer; reuse here for a submissions-focused route.
  return <TeacherManager />
}

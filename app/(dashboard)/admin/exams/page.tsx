import { auth } from "@/auth"
import { TeacherManager } from "@/components/teacher-manager"

export default async function AdminExamsPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "admin") {
    return null
  }
  return <TeacherManager />
}

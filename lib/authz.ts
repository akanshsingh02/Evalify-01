import { auth } from "@/auth"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error("UNAUTHORIZED")
  return session
}

export async function requireRole(roles: Array<string>) {
  const session = await requireAuth()
  const role = (session.user as any)?.role as string | undefined
  if (!role || !roles.includes(role)) throw new Error("FORBIDDEN")
  return session
}



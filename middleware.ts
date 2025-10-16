import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: Request) {
  const url = new URL(req.url)
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })

  // Public routes
  const publicPrefixes = ["/", "/login", "/register", "/api/auth", "/api/register"]
  const isPublic = publicPrefixes.some((p) => url.pathname === p || url.pathname.startsWith(p + "/"))
  if (isPublic) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(url.pathname)}`, url.origin))
  }

  const role = (token as any).role as string | undefined
  if (url.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", url.origin))
  }
  if (url.pathname.startsWith("/teacher") && !["teacher", "admin"].includes(role || "")) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }
  if (url.pathname.startsWith("/student") && !["student", "admin"].includes(role || "")) {
    return NextResponse.redirect(new URL("/login", url.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|public).*)"],
}



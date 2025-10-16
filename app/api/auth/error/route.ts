import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const error = url.searchParams.get("error")
  const target = new URL(`/login${error ? `?error=${encodeURIComponent(error)}` : ""}`, url.origin)
  return NextResponse.redirect(target)
}

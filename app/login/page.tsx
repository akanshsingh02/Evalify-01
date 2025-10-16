"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const [role, setRole] = useState<string>("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const strength = Math.min(100, password.length * 10)

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Progress value={strength} aria-label="Password strength" />
            </div>
            <div className="grid gap-2">
              <Label>Role (for preview only)</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger aria-label="Select role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(error || params.get("error")) && (
              <Alert variant="destructive">
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>
                  {error || (params.get("error") === "CredentialsSignin" ? "Invalid email or password" : "Unable to sign in")}
                </AlertDescription>
              </Alert>
            )}
            <Button
              onClick={async () => {
                setError(null)
                setLoading(true)
                const res = await signIn("credentials", {
                  redirect: false,
                  email,
                  password,
                })
                if (!res || res.error) {
                  setError("Invalid email or password")
                  setLoading(false)
                  return
                }
                const next = params.get("next")
                if (next) {
                  router.push(next)
                } else {
                  // Get session to determine server-authoritative role
                  const sRes = await fetch("/api/auth/session")
                  const s = await sRes.json().catch(() => null)
                  const r = s?.user?.role as string | undefined
                  const target = r === "admin" ? "/admin" : r === "teacher" ? "/teacher" : "/student"
                  router.push(target)
                }
                setLoading(false)
              }}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-4" /> Signing in...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              No account?{" "}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">Social login placeholders: Google, Microsoft</div>
          </CardContent>
        </Card>
        <div className="hidden md:block animate-fade-in-up [animation-delay:120ms]">
          <img
            src="/secure-login-education-platform.jpg"
            alt="Students logging into a secure education platform"
            className="h-auto w-full rounded-lg border"
            loading="lazy"
          />
        </div>
      </main>
    </>
  )
}

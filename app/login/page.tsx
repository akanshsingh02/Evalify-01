"use client"

import Link from "next/link"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function LoginPage() {
  const [role, setRole] = useState<string>("student")
  const [password, setPassword] = useState("")

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
              <Input id="email" type="email" placeholder="you@example.com" />
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
              <Label>Role</Label>
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
            <Button asChild>
              <Link href={`/${role}`}>Continue</Link>
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

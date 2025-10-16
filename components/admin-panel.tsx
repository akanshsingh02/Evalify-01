"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type User = { _id: string; name?: string; email: string; role: "student" | "teacher" | "admin" }

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [siteName, setSiteName] = useState("")
  const [maintenance, setMaintenance] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(false)

  async function loadUsers() {
    setLoadingUsers(true)
    const res = await fetch("/api/admin/users")
    const data = await res.json().catch(() => ({ users: [] }))
    setUsers(Array.isArray(data.users) ? data.users : [])
    setLoadingUsers(false)
  }

  async function loadSettings() {
    setLoadingSettings(true)
    const res = await fetch("/api/admin/settings")
    const data = await res.json().catch(() => ({ settings: {} }))
    setSiteName(data?.settings?.siteName || "Evalify")
    setMaintenance(Boolean(data?.settings?.maintenanceMode))
    setLoadingSettings(false)
  }

  useEffect(() => {
    loadUsers()
    loadSettings()
  }, [])

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {loadingUsers && <div className="text-sm text-muted-foreground">Loading users...</div>}
          {!loadingUsers && users.length === 0 && <div className="text-sm text-muted-foreground">No users found.</div>}
          {!loadingUsers &&
            users.map((u) => (
              <div key={u._id} className="flex items-center justify-between gap-2 rounded-md border p-3">
                <div className="text-sm">
                  <div className="font-medium">{u.name || "Unnamed"}</div>
                  <div className="text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="h-9 rounded-md border px-2 text-sm"
                    value={u.role}
                    onChange={async (e) => {
                      const role = e.target.value as User["role"]
                      await fetch(`/api/admin/users/${u._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ role }),
                      })
                      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, role } : x)))
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!confirm(`Delete user ${u.email}?`)) return
                      await fetch(`/api/admin/users/${u._id}`, { method: "DELETE" })
                      await loadUsers()
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {loadingSettings && <div className="text-sm text-muted-foreground">Loading settings...</div>}
          <div className="grid gap-2">
            <label className="text-sm">Site Name</label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="maintenance"
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
            />
            <label htmlFor="maintenance" className="text-sm">
              Maintenance Mode
            </label>
          </div>
          <div>
            <Button
              onClick={async () => {
                await fetch("/api/admin/settings", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ siteName, maintenanceMode: maintenance }),
                })
                await loadSettings()
              }}
            >
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

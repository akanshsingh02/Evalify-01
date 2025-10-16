import { promises as fs } from "fs"
import path from "path"

export const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
])

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

export async function saveBlobToUploads(blob: Blob, originalName: string) {
  const mime = blob.type || "application/octet-stream"
  if (!ALLOWED_MIME.has(mime)) {
    throw new Error("UNSUPPORTED_FILE_TYPE")
  }
  const now = new Date()
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  const uploadsRoot = path.join(process.cwd(), "public", "uploads", stamp)
  await ensureDir(uploadsRoot)
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_")
  const rand = Math.random().toString(36).slice(2, 8)
  const filePath = path.join(uploadsRoot, `${rand}-${safeName}`)
  const ab = await blob.arrayBuffer()
  await fs.writeFile(filePath, Buffer.from(ab))
  // Return project-relative path
  const rel = path.relative(path.join(process.cwd(), "public"), filePath)
  return `/${rel.replace(/\\/g, "/")}`
}

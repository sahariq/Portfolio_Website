import { promises as fs } from "fs"
import path from "path"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// The explorer is sandboxed to this folder. Nothing outside it is ever listed.
// Create it and put your virtual folders inside, e.g.
//   public/files/Documents, public/files/Pictures, public/files/Music
const ROOT = path.resolve(process.cwd(), "public", "files")

function normalizeApiPath(p: string) {
  const withSlashes = p.replace(/\\/g, "/")
  const withLeading = withSlashes.startsWith("/") ? withSlashes : `/${withSlashes}`
  const collapsed = withLeading.replace(/\/+/g, "/")
  return collapsed.length > 1 ? collapsed.replace(/\/+$/, "") : collapsed
}

// Resolve a virtual path to a real one and make sure it stays inside ROOT
function resolveInsideRoot(virtualPath: string): string | null {
  if (virtualPath.includes("\0")) return null
  const abs = path.resolve(ROOT, "." + virtualPath)
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) return null
  return abs
}

export async function GET(req: NextRequest) {
  const virtualPath = normalizeApiPath(req.nextUrl.searchParams.get("path") || "/")
  const absPath = resolveInsideRoot(virtualPath)

  if (!absPath) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  try {
    const entries = await fs.readdir(/* turbopackIgnore: true */ absPath, { withFileTypes: true })

    const files = await Promise.all(
      entries
        .filter((e) => !e.name.startsWith(".")) // hide dotfiles
        .map(async (entry) => {
          const fullPath = path.join(/* turbopackIgnore: true */ absPath, entry.name)
          const stats = await fs.stat(fullPath)
          return {
            name: entry.name,
            path: normalizeApiPath(`${virtualPath}/${entry.name}`),
            size: stats.size,
            type: entry.isDirectory() ? "directory" : "file",
            modifiedDate: stats.mtime,
          }
        }),
    )

    return NextResponse.json(files, { headers: { "Cache-Control": "no-store" } })
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === "ENOENT" || code === "ENOTDIR") {
      return NextResponse.json({ error: "Directory not found" }, { status: 404 })
    }
    if (code === "EACCES") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }
    return NextResponse.json({ error: "Failed to read directory" }, { status: 500 })
  }
}
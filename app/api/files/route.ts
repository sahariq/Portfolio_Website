import { promises as fs } from 'fs';
import { join } from 'path';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Helper to validate and normalize paths (basic, for demo)
function isValidPath(path: string) {
  return typeof path === 'string' && !path.includes('..') && !path.includes('\0');
}

function normalizeApiPath(path: string) {
  const withForwardSlashes = path.replace(/\\/g, '/');
  const withLeadingSlash = withForwardSlashes.startsWith('/') ? withForwardSlashes : `/${withForwardSlashes}`;
  const normalized = withLeadingSlash.replace(/\/+/g, '/');
  return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dirPath = normalizeApiPath(searchParams.get('path') || '/');
  if (!isValidPath(dirPath)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }
  try {
    const absPath = join(process.cwd(), dirPath);
    const entries = await fs.readdir(absPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = join(absPath, entry.name);
        const stats = await fs.stat(fullPath);
        return {
          name: entry.name,
          path: normalizeApiPath(`${dirPath}/${entry.name}`),
          size: stats.size,
          type: entry.isDirectory() ? 'directory' : 'file',
          modifiedDate: stats.mtime,
        };
      })
    );
    return NextResponse.json(files);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Directory not found' }, { status: 404 });
    }
    if (error.code === 'EACCES') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const PRODUCTS_DIR = path.join(process.cwd(), "media", "products");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } },
) {
  const filePath = path.join(PRODUCTS_DIR, ...params.path);

  if (!filePath.startsWith(PRODUCTS_DIR)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const file = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    return new NextResponse(file, {
      headers: {
        "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

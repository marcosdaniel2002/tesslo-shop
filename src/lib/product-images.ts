import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const PRODUCTS_DIR = path.join(process.cwd(), "media", "products");

export async function saveProductImage(file: File): Promise<string> {
  await mkdir(PRODUCTS_DIR, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(PRODUCTS_DIR, filename), buffer);

  return filename;
}

export async function deleteProductImage(filename: string): Promise<void> {
  try {
    await unlink(path.join(PRODUCTS_DIR, filename));
  } catch (e: any) {
    if (e.code !== "ENOENT") throw e;
  }
}

import { prisma } from "@/lib/db";
import { unlink } from "node:fs/promises";
import path from "node:path";

const UPLOAD_PATH = /^\/uploads\/([0-9a-f-]{36}\.(?:jpg|png|webp))$/i;

export async function deleteUploadedImageIfUnused(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl) return;
  const match = UPLOAD_PATH.exec(imageUrl);
  if (!match?.[1]) return;

  const references = await prisma.blog.count({ where: { imageUrl } });
  if (references > 0) return;

  const uploadRoot = path.resolve(process.cwd(), "public", "uploads");
  const target = path.resolve(uploadRoot, match[1]);
  if (path.dirname(target) !== uploadRoot) return;

  try {
    await unlink(target);
  } catch {
    // Database mutation has already succeeded; cleanup is best-effort and can
    // be retried by an operational orphan sweep.
  }
}

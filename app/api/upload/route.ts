import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);
const UPLOAD_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "uploads"
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image is too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const originalExt = path.extname(safeName).toLowerCase();
    const ext = originalExt || ALLOWED_TYPES.get(file.type) || ".jpg";
    const baseName = path.basename(safeName, originalExt).slice(0, 60);
    const fileName = `${Date.now()}-${randomUUID()}-${baseName}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${fileName}`,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

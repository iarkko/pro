import { NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export async function POST(req: Request) {
  console.log("🚀 UPLOAD API HIT");

  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file || !(file instanceof File)) {
      console.log("❌ Invalid or missing file");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("📄 File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🧼 sanitize filename
    const safeOriginalName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.\-_]/g, "");

    const fileName = `${Date.now()}-${safeOriginalName}`;

    // 📦 stable docker path
    const uploadDir = path.join(process.cwd(), "uploads");

    const filePath = path.join(uploadDir, fileName);

    console.log("📁 Upload dir:", uploadDir);
    console.log("📍 File path:", filePath);

    await mkdir(uploadDir, { recursive: true });

    await writeFile(filePath, buffer);

    console.log("💾 File written successfully");

    return NextResponse.json({
      url: `/uploads/${fileName}`,
    });
  } catch (e: any) {
    console.error("💥 UPLOAD ERROR:", e);

    return NextResponse.json(
      {
        error: "Upload failed",
        details: e?.message || String(e),
      },
      { status: 500 }
    );
  }
}
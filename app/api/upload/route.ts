import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  console.log("🚀 UPLOAD API HIT");

  try {
    const data = await req.formData();
    console.log("📦 FormData received");

    const file = data.get("file");

    if (!file || !(file instanceof File)) {
      console.log("❌ Invalid or missing file");
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    console.log("📄 File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("🧠 Buffer created:", buffer.length);

    const fileName = `${Date.now()}-${file.name}`;

    // ⚠️ ВАЖНО: единый путь с nginx + docker volume
    const uploadDir = "/app/uploads";

    const filePath = path.join(uploadDir, fileName);

    console.log("📁 Upload dir:", uploadDir);
    console.log("📍 File path:", filePath);

    await fs.mkdir(uploadDir, { recursive: true });

    console.log("📂 Directory ensured");

    await writeFile(filePath, buffer);

    console.log("💾 File written successfully");

    // защита от Windows-слэшей в имени файла
    const safeFileName = fileName.replace(/\\/g, "");

    return NextResponse.json({
      url: `/uploads/${safeFileName}`,
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
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB — đủ cho ảnh và video ngắn minh hoạ

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Không có file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Chỉ nhận file ảnh hoặc video" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File tối đa 20MB" }, { status: 400 });
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url, type: file.type.startsWith("video/") ? "video" : "image" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Upload thất bại — kiểm tra đã cấu hình BLOB_READ_WRITE_TOKEN chưa" },
      { status: 500 }
    );
  }
}

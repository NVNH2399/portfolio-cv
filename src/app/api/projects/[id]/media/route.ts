import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const items = await prisma.media.findMany({
    where: { projectId: Number(id) },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { id } = await params;
  const { url, type } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "Thiếu url" }, { status: 400 });
  }

  const count = await prisma.media.count({ where: { projectId: Number(id) } });

  const item = await prisma.media.create({
    data: {
      projectId: Number(id),
      url,
      type: type === "video" ? "video" : "image",
      order: count,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

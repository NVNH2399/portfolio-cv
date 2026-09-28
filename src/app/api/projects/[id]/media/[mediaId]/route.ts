import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { mediaId } = await params;
  await prisma.media.delete({ where: { id: Number(mediaId) } });
  return NextResponse.json({ ok: true });
}

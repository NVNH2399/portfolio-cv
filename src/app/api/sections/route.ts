import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.homeSection.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

// Nhan nguyen mang { id, order, visible }[] va luu lai tat ca cung luc -
// don gian hon nhieu so voi lam CRUD tung dong cho 4 hang co dinh nay.
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const items: { id: number; order: number; visible: boolean }[] = await req.json();

  await Promise.all(
    items.map((item) =>
      prisma.homeSection.update({
        where: { id: item.id },
        data: { order: item.order, visible: item.visible },
      })
    )
  );

  return NextResponse.json({ ok: true });
}

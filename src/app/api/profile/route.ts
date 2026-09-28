import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await req.json();
  const existing = await prisma.profile.findFirst();

  const data = {
    name: body.name,
    titleVi: body.titleVi,
    titleEn: body.titleEn,
    email: body.email,
    phone: body.phone,
    location: body.location,
    github: body.github || null,
    linkedin: body.linkedin || null,
    avatarUrl: body.avatarUrl || null,
    summaryVi: body.summaryVi,
    summaryEn: body.summaryEn,
  };

  const updated = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data })
    : await prisma.profile.create({ data });

  return NextResponse.json(updated);
}
